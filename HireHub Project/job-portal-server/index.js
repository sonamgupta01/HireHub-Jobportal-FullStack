
// mongo db
// username : sonam98450
// password : uXKxQzOOjibnYDGS


const express = require('express')
const app = express()
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 3000;
require('dotenv').config()
console.log(process.env.DB_USER)

app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://sonam98450:${process.env.DB_PASSWORD}@job-portal-demo.stgsae7.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-demo`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("mernjobPortal");
    const jobsCollection = db.collection("demoJobs");
    const usersCollection = db.collection("users");
    const applicationsCollection = db.collection("applications");

    // POST a job
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date(); // fixed typo from createAt → createdAt
      const result = await jobsCollection.insertOne(body);
      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(500).send({
          message: "Unable to insert, try again later",
          status: false
        });
      }
    });

    // GET all jobs
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobsCollection.find({}).toArray();
      res.send(jobs);
    });

    // get jobs by email
    app.get("/myJobs/:email", async(req,res)=>{
       //console.log(req.params.email)
       const jobs = await jobsCollection.find({postedBy : req.params.email}).toArray();
       res.send(jobs)
    })

    //delete a job
    app.delete("/job/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const result = await jobsCollection.deleteOne(filter);
      res.send(result)
    })

    // update a job
    app.patch("/update-job/:id", async(req,res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = {_id : new ObjectId(id)};
      const updateDoc = {
        $set: {
          ...jobData,
        },
      };
      const options = { upsert: true };
      const result = await jobsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // USER AUTHENTICATION ROUTES
    
    // Register user
    app.post("/register", async(req, res) => {
      try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).send({ message: "User already exists" });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = {
          name,
          email,
          password: hashedPassword,
          role,
          createdAt: new Date()
        };
        
        const result = await usersCollection.insertOne(user);
        res.status(201).send({ message: "User registered successfully", userId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: "Registration failed", error: error.message });
      }
    });

    // Login user
    app.post("/login", async(req, res) => {
      try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
          res.status(200).send({ 
            message: "Login successful", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
          });
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      } catch (error) {
        res.status(500).send({ message: "Login failed", error: error.message });
      }
    });

    // APPLICATION ROUTES
    
    // Apply for a job
    app.post("/apply-job", async(req, res) => {
      try {
        const applicationData = {
          ...req.body,
          appliedAt: new Date(),
          status: "pending"
        };
        
        // Check if user already applied for this job
        const existingApplication = await applicationsCollection.findOne({
          jobId: applicationData.jobId,
          candidateEmail: applicationData.candidateEmail
        });
        
        if (existingApplication) {
          return res.status(400).send({ message: "Already applied for this job" });
        }
        
        const result = await applicationsCollection.insertOne(applicationData);
        res.status(201).send({ message: "Application submitted successfully", applicationId: result.insertedId });
      } catch (error) {
        res.status(500).send({ message: "Application failed", error: error.message });
      }
    });

    // Get applications for a user (student)
    app.get("/my-applications/:email", async(req, res) => {
      try {
        const applications = await applicationsCollection.find({ candidateEmail: req.params.email }).toArray();
        res.send(applications);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch applications", error: error.message });
      }
    });

    // Get applications for jobs posted by recruiter
    app.get("/job-applications/:recruiterEmail", async(req, res) => {
      try {
        // First get all jobs posted by this recruiter
        const recruiterJobs = await jobsCollection.find({ postedBy: req.params.recruiterEmail }).toArray();
        const jobIds = recruiterJobs.map(job => job._id.toString());
        
        // Then get all applications for these jobs
        const applications = await applicationsCollection.find({ jobId: { $in: jobIds } }).toArray();
        res.send(applications);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch applications", error: error.message });
      }
    });

    // Update application status
    app.patch("/application-status/:id", async(req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: status,
            updatedAt: new Date()
          }
        };
        
        const result = await applicationsCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update application status", error: error.message });
      }
    });

    // DEMO DATA SEEDING ENDPOINT (for development only)
    app.post("/seed-demo-data", async(req, res) => {
      try {
        // Check if jobs already exist
        const existingJobs = await jobsCollection.countDocuments();
        if (existingJobs > 0) {
          return res.status(200).send({ message: "Demo data already exists", count: existingJobs });
        }

        const demoJobs = [
          {
            jobTitle: "Frontend Developer",
            companyName: "TechCorp Inc.",
            minPrice: "60000",
            maxPrice: "80000",
            salaryType: "Yearly",
            jobLocation: "Mumbai, India",
            postingDate: new Date(),
            experienceLevel: "Mid-level",
            employmentType: "Full-time",
            description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.",
            postedBy: "recruiter@techcorp.com",
            skills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
            createdAt: new Date()
          },
          {
            jobTitle: "Software Engineering Intern",
            companyName: "StartupXYZ",
            minPrice: "25000",
            maxPrice: "35000",
            salaryType: "Yearly",
            jobLocation: "Bangalore, India",
            postingDate: new Date(),
            experienceLevel: "Entry-level",
            employmentType: "Internship",
            description: "Great opportunity for students to gain hands-on experience in software development. You'll work alongside senior developers on real projects.",
            postedBy: "hr@startupxyz.com",
            skills: ["Python", "JavaScript", "Git", "SQL"],
            createdAt: new Date()
          }
        ];

        const result = await jobsCollection.insertMany(demoJobs);
        res.status(201).send({ 
          message: "Demo data seeded successfully", 
          insertedCount: result.insertedCount 
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to seed demo data", error: error.message });
      }
    });

    // Optional: Ping the database
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (err) {
    console.error(err);
  }
  // ❌ Don't close the client here if routes need it
  // await client.close();
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

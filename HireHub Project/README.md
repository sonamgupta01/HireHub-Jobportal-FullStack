# 🚀 HireHub - Complete Job Portal Platform

A modern, full-stack job portal application built with React, Node.js, Express, and MongoDB. HireHub connects job seekers with recruiters in a seamless, user-friendly platform.

## ✨ Features

### 👨‍💼 For Recruiters
- **Post Jobs**: Create detailed job listings with requirements, salary, and benefits
- **Manage Jobs**: Edit, update, or delete existing job postings
- **View Applications**: Review candidate applications with filtering options
- **Application Management**: Change application status (pending, shortlisted, rejected, hired)
- **Dashboard**: Overview of posted jobs, applications received, and key metrics

### 👨‍🎓 For Students/Job Seekers
- **Browse Jobs**: Search and filter jobs by location, salary, experience, etc.
- **Apply for Jobs**: One-click job applications with status tracking
- **Save Jobs**: Bookmark interesting jobs for later review
- **Track Applications**: Monitor application status and history
- **Dashboard**: Personal overview of applied jobs, saved jobs, and application status

### 🔐 Authentication & Security
- User registration with role selection (Student/Recruiter)
- Secure login system
- Role-based access control
- Protected routes for authenticated users

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
HireHub Project/
├── job-portal-client/          # Frontend React Application
│   ├── src/
│   │   ├── Pages/             # Main application pages
│   │   │   ├── Home.jsx       # Landing page with job listings
│   │   │   ├── Jobs.jsx       # Job search and filtering
│   │   │   ├── Dashboard.jsx  # User dashboard (role-based)
│   │   │   ├── Login.jsx      # User authentication
│   │   │   ├── Signup.jsx     # User registration
│   │   │   ├── CreateJob.jsx  # Job posting form
│   │   │   ├── MyJobs.jsx     # Recruiter's job management
│   │   │   ├── AppliedJobs.jsx # Student's application history
│   │   │   ├── SavedJobs.jsx  # Student's saved jobs
│   │   │   ├── Applications.jsx # Recruiter's application review
│   │   │   └── About.jsx      # About page
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── Banner.jsx     # Search banner
│   │   │   ├── Card.jsx       # Job card component
│   │   │   └── Newsletter.jsx # Newsletter subscription
│   │   ├── sidebar/           # Filter components
│   │   ├── Router/            # Routing configuration
│   │   └── ...
│   └── ...
└── job-portal-server/          # Backend Node.js Application
    ├── index.js               # Main server file with all APIs
    ├── .env                   # Environment variables
    └── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "HireHub Project"
```

2. **Setup Backend**
```bash
cd job-portal-server
npm install
```

3. **Setup Frontend**
```bash
cd ../job-portal-client
npm install
```

4. **Environment Configuration**
Create a `.env` file in the `job-portal-server` directory:
```env
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password
PORT=3000
```

### Running the Application

1. **Start the Backend Server**
```bash
cd job-portal-server
npm start
# Server runs on http://localhost:3000
```

2. **Start the Frontend (in a new terminal)**
```bash
cd job-portal-client
npm run dev
# Client runs on http://localhost:5173
```

## 🌐 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login

### Jobs
- `GET /all-jobs` - Get all job listings
- `POST /post-job` - Create new job posting
- `GET /myJobs/:email` - Get jobs posted by recruiter
- `PATCH /update-job/:id` - Update job details
- `DELETE /job/:id` - Delete job posting

### Applications
- `POST /apply-job` - Submit job application
- `GET /my-applications/:email` - Get user's applications
- `GET /job-applications/:recruiterEmail` - Get applications for recruiter's jobs
- `PATCH /application-status/:id` - Update application status

## 💡 Key Features Explained

### Role-Based Dashboard
The dashboard dynamically changes based on user role:
- **Students** see applied jobs, saved jobs, and browse options
- **Recruiters** see posted jobs, applications, and posting tools

### Smart Job Search
- Real-time search with filtering
- Filter by location, salary, experience level, job type
- Pagination for better performance

### Application Tracking
- Complete application lifecycle management
- Status updates (pending → shortlisted → hired/rejected)
- Email notifications (ready for implementation)

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Works seamlessly on desktop, tablet, and mobile

## 🎨 Screenshots & Demo

### Home Page
- Clean, modern landing page
- Featured job listings
- Quick search functionality

### Dashboard Views
- Student dashboard with application tracking
- Recruiter dashboard with job management
- Statistics and quick action buttons

### Job Application Flow
- Browse → Save → Apply → Track
- Intuitive user experience
- Real-time status updates

## 🔮 Future Enhancements

- [ ] Email notifications for application updates
- [ ] Resume upload and parsing
- [ ] Advanced search with AI recommendations
- [ ] Chat/messaging between recruiters and candidates
- [ ] Company profiles and ratings
- [ ] Job recommendation algorithm
- [ ] Interview scheduling system
- [ ] Salary insights and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Author

**Sonam Gupta**
- Email: Sonam98450@gmail.com
- LinkedIn: https://www.linkedin.com/in/sonam-gupta-69a181289/
- GitHub:https://github.com/sonamgupta01

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility classes
- MongoDB for the flexible database

**Made with ❤️ for connecting talent with opportunities**
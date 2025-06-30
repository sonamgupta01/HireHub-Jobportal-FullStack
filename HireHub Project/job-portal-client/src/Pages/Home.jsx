import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Sidebar from "../sidebar/Sidebar";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const [selectedCategory,setSelectedCategory] = useState(null);
  const[jobs,setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =6;

  useEffect(()=>{
    setIsLoading(true);
    //fetch("jobs.json")
    fetch("http://localhost:3000/all-jobs").then(res => res.json()).then(data =>{
        setJobs(data)
        setIsLoading(false);
    })
  },[])

//   console.log(jobs)


  //handle input change
  const[query,setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  }

  //filter jobs by title
    const filteredItems = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);


  //..................Radio filtering..........
  const handleChange = (event)=>{
    setSelectedCategory(event.target.value)
    console.log("Filter selected:", event.target.value)
    console.log("Available jobs:", jobs.length)
  }

   //..................Button based filtering..........
   const handleClick = (event)=>{
    setSelectedCategory(event.target.value)
    console.log("Button filter selected:", event.target.value)
   }

   // calculate the index range
   const calculatePageRange = () =>{
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {startIndex,endIndex};
   }

   // function for the next page
   const nextPage = () =>{
        if(currentPage < Math.ceil(filteredItems.length / itemsPerPage)){
            setCurrentPage(currentPage + 1);
        }
   }

   // function for the previous page
   const prevPage = () =>{
    if(currentPage > 1){
        setCurrentPage(currentPage - 1);
    }
   }


   // main function
   const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    // First apply search query filter
    if (query) {
      filteredJobs = filteredJobs.filter((job) =>
        job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }

    // Then apply category filtering
    if (selected) {
      filteredJobs = filteredJobs.filter((job) => {
        const { jobLocation, maxPrice, minPrice, experienceLevel, salaryType, employmentType, postingDate } = job;

        // Location filter (exact match)
        if (jobLocation && jobLocation.toLowerCase() === selected.toLowerCase()) {
          console.log("Location match:", jobLocation, "=", selected);
          return true;
        }

        // Salary filter (for numeric values like 30, 50, 80, 100)
        if (!isNaN(selected)) {
          const selectedSalary = parseInt(selected);
          const jobMaxSalary = parseInt(maxPrice) || 0;
          const jobMinSalary = parseInt(minPrice) || 0;

          // Check if job salary is within the selected range
          if (jobMaxSalary <= selectedSalary || jobMinSalary <= selectedSalary) {
            console.log("Salary match:", jobMaxSalary, "<=", selectedSalary);
            return true;
          }
        }

        // Date filter (for date strings like "2024-01-15")
        if (selected.includes('-') && postingDate) {
          const selectedDate = new Date(selected);
          const jobDate = new Date(postingDate);
          if (jobDate >= selectedDate) {
            console.log("Date match:", jobDate, ">=", selectedDate);
            return true;
          }
        }

        // Salary type filter (Hourly, Monthly, Yearly)
        if (salaryType && salaryType.toLowerCase() === selected.toLowerCase()) {
          console.log("Salary type match:", salaryType, "=", selected);
          return true;
        }

        // Experience level filter (Internship, Remote, etc.)
        if (experienceLevel && experienceLevel.toLowerCase() === selected.toLowerCase()) {
          console.log("Experience match:", experienceLevel, "=", selected);
          return true;
        }

        // Employment type filter (Full-time, Part-time, Temporary)
        if (employmentType && employmentType.toLowerCase() === selected.toLowerCase()) {
          console.log("Employment type match:", employmentType, "=", selected);
          return true;
        }

        // Special cases for common filter values
        if (selected.toLowerCase() === 'full-time' && employmentType && employmentType.toLowerCase().includes('full')) {
          return true;
        }

        if (selected.toLowerCase() === 'part-time' && employmentType && employmentType.toLowerCase().includes('part')) {
          return true;
        }

        if (selected.toLowerCase() === 'temporary' && employmentType && employmentType.toLowerCase().includes('temp')) {
          return true;
        }

        return false;
      });

      console.log("Filtered jobs:", filteredJobs.length, "with filter:", selected);
    }

    // slice the data to show only the items per page
    const { startIndex, endIndex } = calculatePageRange();
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    return paginatedJobs.map((data, i) => <Card key={i} data={data} />);
};


   const result = filteredData(jobs,selectedCategory, query);

   // Calculate total filtered jobs for pagination
   const getFilteredJobsCount = () => {
     let filteredJobs = jobs;

     if (query) {
       filteredJobs = filteredJobs.filter((job) =>
         job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
       );
     }

     if (selectedCategory) {
       filteredJobs = filteredJobs.filter((job) => {
         const { jobLocation, maxPrice, experienceLevel, salaryType, employmentType, postingDate } = job;
         return (
           (jobLocation && jobLocation.toLowerCase() === selectedCategory.toLowerCase()) ||
           (!isNaN(selectedCategory) && maxPrice && parseInt(maxPrice) <= parseInt(selectedCategory)) ||
           (postingDate && postingDate >= selectedCategory) ||
           (salaryType && salaryType.toLowerCase() === selectedCategory.toLowerCase()) ||
           (experienceLevel && experienceLevel.toLowerCase() === selectedCategory.toLowerCase()) ||
           (employmentType && employmentType.toLowerCase() === selectedCategory.toLowerCase())
         );
       });
     }

     return filteredJobs.length;
   };

   const totalFilteredJobs = getFilteredJobsCount();

  return(
    <div>
        <Banner query={query} handleInputChange = {handleInputChange}/>
        {/* main content */}
        <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">

            {/* left side */}
            <div className="bg-white p-4 rounded">
                <Sidebar handleChange={handleChange} handleClick={handleClick}/>
            </div>

            {/* job Cards */}
            <div className="col-span-2 bg-white p-4 rounded-sm">
                {
                    isLoading ? (<p>Loading....</p>): result.length > 0 ?  (<div className="space-y-4">{result}</div>) : <>
                    <h3>0 Jobs</h3>
                    <p>No jobs found for the selected filter. Try different criteria!</p>
                    </>
                }


                {/* pagination here */}
                {
                    result.length > 0 ? (
                      <div className="flex justify-center mt-4 space-x-8">
                        <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Previous</button>
                        <span className="mx-2 px-3 py-1">Page {currentPage} of {Math.ceil(totalFilteredJobs / itemsPerPage)}</span>
                        <button onClick={nextPage} disabled={currentPage === Math.ceil(totalFilteredJobs / itemsPerPage)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Next</button>
                      </div>
                    ) : ""
                }
            </div>

            {/*right side */}
            <div className="bg-white p-4 rounded"><Newsletter/></div>
        </div>
    </div>
  )
   
};

export default Home;

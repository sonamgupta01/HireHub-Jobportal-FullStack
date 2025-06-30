import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to load jobs from storage
  const loadJobsFromStorage = useCallback(() => {
    if (!user?.email) {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    try {
      const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');

      // Filter jobs by current user
      const userJobs = storedJobs.filter(job => job.postedBy === user.email);

      setJobs(userJobs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading jobs from localStorage:', error);
      setJobs([]);
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    console.log('=== MY JOBS USEEFFECT TRIGGERED ===');
    console.log('User object:', user);
    console.log('User email:', user?.email);

    if (!user) {
      console.log('No user found, waiting...');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadJobsFromStorage();

  }, [user, loadJobsFromStorage]);

  // Also refresh jobs when the component becomes visible (user returns from posting a job)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.email) {
        console.log('Page became visible, refreshing jobs...');
        loadJobsFromStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.email, loadJobsFromStorage]);

  const handleSearch = () => {
    const filter = jobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    setJobs(filter);
    setIsLoading(false);
  };

  const handleDelete = (id) => {
    // Delete from localStorage
    try {
      const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = storedJobs.filter(job => job._id !== id);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));

      // Update local state
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job deleted successfully");
    } catch (error) {
      console.error('Error deleting job:', error);
    }

    // Also try API delete (optional)
    fetch(`http://localhost:3000/job/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('API delete response:', data);
      })
      .catch((error) => {
        console.log('API delete failed, but local delete succeeded');
      });
  };





  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="my-jobs-container">
        <h1 className="text-center p-4">ALL MY JOBS</h1>



        <div className="search-box p-2 text-center mb-2">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            name="search"
            id="search"
            className="py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full"
          />
          <button onClick={handleSearch} className="bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4">
            Search
          </button>
        </div>
      </div>

      <section className="py-1 bg-blueGray-50">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-5">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    All Jobs
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link to="/create-job">
                    <button
                      type="button"
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 transition-all duration-150 ease-linear"
                    >
                      Post A New Job
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      No.
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Title
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Company&nbsp;Name
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Salary
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Edit
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Delete
                    </th>
                  </tr>
                </thead>

                {isLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8">
                          <div className="text-gray-500">
                            <p className="text-lg font-semibold mb-2">No jobs found</p>
                            <p className="text-sm">You haven't posted any jobs yet.</p>
                            <p className="text-sm">Click "Add Test Job" above to create a test job, or</p>
                            <p className="text-sm">use "Post A New Job" to create a real job.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job, index) => (
                        <tr key={job._id}>
                          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                            {index + 1}
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {job.jobTitle}
                          </td>
                          <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {job.postedBy}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            Rs{job.minPrice} - Rs{job.maxPrice}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <button>
                              <Link to={`/edit-job/${job._id}`}>Edit</Link>
                            </button>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="bg-red-700 py-2 px-6 text-white rounded-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyJobs;

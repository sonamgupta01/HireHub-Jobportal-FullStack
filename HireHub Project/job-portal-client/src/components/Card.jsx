import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiCalendar, FiBookmark, FiHeart } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Card = ({data}) => {
  const {_id, companyName,jobTitle,companyLogo,minPrice,maxPrice,salaryType,jobLocation,employmentType,postingDate,description} = data;
  const { user, isStudent } = useAuth();
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if job is already saved/applied when component mounts
  useEffect(() => {
    if (user && isStudent()) {
      // Check if already applied
      checkApplicationStatus();
      // Check if already saved
      checkSavedStatus();
    }
  }, [user, _id]);

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/my-applications/${user.email}`);
      const applications = await response.json();
      const hasApplied = applications.some(app => app.jobId === _id);
      setIsApplied(hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const checkSavedStatus = () => {
    // Get saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(_id));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user || !isStudent()) {
      alert('Please login as a student to apply for jobs');
      return;
    }

    if (isApplied) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/apply-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: _id,
          candidateEmail: user.email,
          candidateName: user.name,
          jobTitle: jobTitle,
          companyName: companyName,
          appliedAt: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsApplied(true);
        alert('Application submitted successfully!');
      } else {
        alert(data.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job');
    }
    setLoading(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!user || !isStudent()) {
      alert('Please login as a student to save jobs');
      return;
    }

    // Get current saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (isSaved) {
      // Remove from saved jobs
      const updatedSavedJobs = savedJobs.filter(jobId => jobId !== _id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setIsSaved(false);
    } else {
      // Add to saved jobs
      const updatedSavedJobs = [...savedJobs, _id];
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setIsSaved(true);
    }
  };

  return (
    <section className='bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex gap-4 items-start flex-1'>
          <img src={companyLogo || 'https://via.placeholder.com/50'} alt={companyName} className='w-12 h-12 rounded-lg object-cover'/>
          <div className='flex-1'>
            <h4 className='text-blue-600 font-medium mb-1'>{companyName}</h4>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>{jobTitle}</h3>
            <div className='text-gray-600 text-sm flex flex-wrap gap-4 mb-3'>
              <span className='flex items-center gap-1'><FiMapPin/>{jobLocation}</span>
              <span className='flex items-center gap-1'><FiClock/>{employmentType}</span>
              <span className="flex items-center gap-1"><FaRupeeSign className='text-xs'/>{minPrice}-{maxPrice} LPA</span>
              <span className='flex items-center gap-1'><FiCalendar/>{postingDate}</span>
            </div>
            <p className='text-gray-600 text-sm line-clamp-2'>{description}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          className={`p-2 rounded-full transition-colors ${
            isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <FiHeart className={isSaved ? 'fill-current' : ''} />
        </button>
      </div>
      
      <div className='flex justify-between items-center mt-4'>
        <div className='flex gap-2'>
          <Link
            to={`/job/${_id}`}
            className='px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition text-sm'
          >
            View Details
          </Link>
        </div>

        <div className='text-xs text-gray-500'>
          Posted {new Date(postingDate).toLocaleDateString()}
        </div>
      </div>
    </section>
  )
}

export default Card



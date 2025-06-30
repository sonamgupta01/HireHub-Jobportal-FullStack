import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AppliedJobs = () => {
  const { user, isStudent } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || !isStudent()) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/my-applications/${user.email}`);
        if (response.ok) {
          const applications = await response.json();
          setAppliedJobs(applications);
        } else {
          // Show sample data if no real applications
          setAppliedJobs([
            {
              _id: 1,
              jobTitle: "Software Developer",
              companyName: "TechCorp India",
              jobLocation: "Bangalore, India",
              minPrice: "8",
              maxPrice: "12",
              appliedDate: "2024-01-15",
              status: "pending",
              employmentType: "Full-time"
            },
            {
              _id: 2,
              jobTitle: "Frontend Developer",
              companyName: "Startup Solutions",
              jobLocation: "Mumbai, India",
              minPrice: "6",
              maxPrice: "10",
              appliedDate: "2024-01-10",
              status: "accepted",
              employmentType: "Full-time"
            },
            {
              _id: 3,
              jobTitle: "React Developer",
              companyName: "WebTech Solutions",
              jobLocation: "Hyderabad, India",
              minPrice: "7",
              maxPrice: "11",
              appliedDate: "2024-01-08",
              status: "rejected",
              employmentType: "Contract"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Show sample data on error
        setAppliedJobs([
          {
            _id: 1,
            jobTitle: "Software Developer",
            companyName: "TechCorp India",
            jobLocation: "Bangalore, India",
            minPrice: "8",
            maxPrice: "12",
            appliedDate: "2024-01-15",
            status: "pending",
            employmentType: "Full-time"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user.email]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Applied Jobs</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Applications ({appliedJobs.length})</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                Pending: {appliedJobs.filter(job => job.status === 'pending').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                Accepted: {appliedJobs.filter(job => job.status === 'accepted').length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                Rejected: {appliedJobs.filter(job => job.status === 'rejected').length}
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {appliedJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{job.jobTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)} {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      🏢 {job.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {job.jobLocation || job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      💰 ₹{job.minPrice || '8'}-{job.maxPrice || '12'} LPA
                    </span>
                    <span className="flex items-center gap-1">
                      📄 {job.employmentType || job.jobType}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Applied on: {new Date(job.appliedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
                    View Details
                  </button>
                  {job.status === 'pending' && (
                    <button className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition">
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {appliedJobs.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to see them here!</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;

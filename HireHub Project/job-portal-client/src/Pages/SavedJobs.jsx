import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Card from '../components/Card';

const SavedJobs = () => {
  const { user, isStudent } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || !isStudent()) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      // Get saved job IDs from localStorage
      const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      
      if (savedJobIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all jobs and filter by saved IDs
      const response = await fetch('http://localhost:3000/all-jobs');
      const allJobs = await response.json();
      
      const savedJobsList = allJobs.filter(job => savedJobIds.includes(job._id));
      setSavedJobs(savedJobsList);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllSavedJobs = () => {
    localStorage.removeItem('savedJobs');
    setSavedJobs([]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Saved Jobs ({savedJobs.length})</h1>
        {savedJobs.length > 0 && (
          <button
            onClick={clearAllSavedJobs}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Clear All
          </button>
        )}
      </div>
      
      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">💼</div>
          <p className="text-gray-500 text-lg mb-4">No saved jobs yet</p>
          <p className="text-gray-400">Start browsing jobs and click the heart icon to save them for later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedJobs.map((job) => (
            <Card key={job._id} data={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;

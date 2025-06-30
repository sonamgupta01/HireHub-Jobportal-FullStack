import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBuilding, FaMapMarkerAlt, FaClock, FaDollarSign, FaCalendar, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    whyHireYou: '',
    experience: '',
    skills: '',
    portfolio: '',
    githubUrl: '',
    expectedSalary: '',
    resumeFile: null,
    resumeFileName: ''
  });

  useEffect(() => {
    console.log('JobDetails useEffect - ID:', id, 'User:', user);
    fetchJobDetails();
    if (user && isStudent()) {
      checkApplicationStatus();
      checkSavedStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      console.log('Fetching job details for ID:', id);

      // First try to get from localStorage (more reliable for recently posted jobs)
      const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      console.log('Local jobs:', localJobs.length);

      let foundJob = localJobs.find(job => job._id === id || job._id.toString() === id);
      console.log('Found job in localStorage:', foundJob);

      // If not found locally, try API
      if (!foundJob) {
        console.log('Job not found locally, trying API...');
        const response = await fetch(`http://localhost:3000/all-jobs`);
        const apiJobs = await response.json();
        console.log('API jobs:', apiJobs.length);

        foundJob = apiJobs.find(job => job._id === id || job._id.toString() === id);
        console.log('Found job in API:', foundJob);
      }

      if (!foundJob) {
        console.error('Job not found with ID:', id);
        console.log('Available local job IDs:', localJobs.map(job => job._id));
      }

      setJob(foundJob);
    } catch (error) {
      console.error('Error fetching job details:', error);

      // Fallback to localStorage only
      try {
        const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const foundJob = localJobs.find(job => job._id === id || job._id.toString() === id);
        setJob(foundJob);
      } catch (localError) {
        console.error('Error accessing localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/my-applications/${user.email}`);
      const applications = await response.json();
      const hasApplied = applications.some(app => app.jobId === id);
      setIsApplied(hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const checkSavedStatus = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(id));
  };

  const handleSave = () => {
    if (!user) {
      alert('Please login to save jobs');
      return;
    }

    if (!isStudent()) {
      alert('Only students can save jobs');
      return;
    }

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let updatedSavedJobs;

    if (isSaved) {
      updatedSavedJobs = savedJobs.filter(jobId => jobId !== id);
      alert('Job removed from saved jobs!');
    } else {
      updatedSavedJobs = [...savedJobs, id];
      alert('Job saved successfully!');
    }

    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    setIsSaved(!isSaved);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user || !isStudent()) {
      alert('Please login as a student to apply for jobs');
      return;
    }

    if (isApplied) return;

    setApplying(true);
    try {
      const applicationPayload = {
        jobId: id,
        candidateEmail: user.email,
        candidateName: user.name,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        appliedAt: new Date().toISOString(),
        ...applicationData
      };

      // Save to localStorage for now (later can be sent to backend)
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      applications.push(applicationPayload);
      localStorage.setItem('jobApplications', JSON.stringify(applications));

      // Also try to send to backend
      const response = await fetch('http://localhost:3000/apply-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationPayload),
      });

      setIsApplied(true);
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Application submitted successfully! (Saved locally)');
      setIsApplied(true);
      setShowApplicationForm(false);
    }
    setApplying(false);
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files for your resume.');
        e.target.value = '';
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        e.target.value = '';
        return;
      }

      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setApplicationData({
          ...applicationData,
          resumeFile: event.target.result,
          resumeFileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
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

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-4">⚠️ Job Not Found</h1>
          <p className="text-red-600 mb-2">Looking for job ID: <code className="bg-red-100 px-2 py-1 rounded">{id}</code></p>
          <p className="text-red-600 mb-4">This job may have been removed or the link is incorrect.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎯 RENDERING JOB DETAILS:', { job, isApplied, isSaved });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* DEBUG INFO */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Debug:</strong> Job ID: {id} | Job Found: {job ? '✅' : '❌'} |
          Applied: {isApplied ? '✅' : '❌'} | Saved: {isSaved ? '✅' : '❌'}
        </p>
      </div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4 flex-1">
            <img 
              src={job.companyLogo || 'https://via.placeholder.com/80'} 
              alt={job.companyName} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.jobTitle}</h1>
              <div className="flex items-center text-blue-600 font-medium mb-2">
                <FaBuilding className="mr-2" />
                <span>{job.companyName}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt/>{job.jobLocation}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock/>{job.employmentType}
                </span>
                <span className="flex items-center gap-1">
                  <FaDollarSign/>{job.minPrice}-{job.maxPrice} LPA
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendar/>Posted: {new Date(job.postingDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              console.log('Apply button clicked!');
              console.log('User:', user);
              console.log('isStudent():', user ? isStudent() : 'No user');

              if (!user) {
                alert('Please login to apply for jobs');
                navigate('/login');
                return;
              }
              if (!isStudent()) {
                alert('Only students can apply for jobs');
                return;
              }
              setShowApplicationForm(true);
            }}
            disabled={isApplied}
            style={{
              minHeight: '60px',
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '16px 32px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              backgroundColor: isApplied ? '#dcfce7' : '#2563eb',
              color: isApplied ? '#166534' : '#ffffff',
              border: isApplied ? '2px solid #bbf7d0' : 'none',
              cursor: isApplied ? 'not-allowed' : 'pointer'
            }}
            className="flex-1"
          >
            {isApplied ? 'Applied ✅' : 'Apply Now ✅'}
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {job.description || 'We are looking for a talented professional to join our team. This is an excellent opportunity to work with cutting-edge technologies and contribute to exciting projects.'}
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Key Responsibilities:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Develop and maintain high-quality software solutions</li>
            <li>Collaborate with cross-functional teams to deliver projects</li>
            <li>Write clean, maintainable, and efficient code</li>
            <li>Participate in code reviews and technical discussions</li>
            <li>Stay updated with latest industry trends and technologies</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Requirements:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Bachelor's degree in Computer Science or related field</li>
            <li>Strong problem-solving and analytical skills</li>
            <li>Excellent communication and teamwork abilities</li>
            <li>Experience with relevant technologies and frameworks</li>
            <li>Passion for learning and professional growth</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">What We Offer:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Competitive salary and benefits package</li>
            <li>Flexible working arrangements</li>
            <li>Professional development opportunities</li>
            <li>Collaborative and inclusive work environment</li>
            <li>Health insurance and wellness programs</li>
          </ul>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🚀 Apply for {job.jobTitle}</h2>
              <p className="text-gray-600">at <span className="font-semibold text-blue-600">{job.companyName}</span></p>
            </div>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter *
                </label>
                <textarea
                  name="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why should we hire you? *
                </label>
                <textarea
                  name="whyHireYou"
                  value={applicationData.whyHireYou}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Highlight your unique qualifications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience
                </label>
                <textarea
                  name="experience"
                  value={applicationData.experience}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your relevant work experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={applicationData.skills}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, Python, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio/LinkedIn URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={applicationData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={applicationData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Salary (LPA)
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={applicationData.expectedSalary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📄 Upload Resume (PDF) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload your resume in PDF format (max 5MB)
                  </p>
                  {applicationData.resumeFileName && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm text-green-700 font-medium">
                        {applicationData.resumeFileName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {applying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit 🚀'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;

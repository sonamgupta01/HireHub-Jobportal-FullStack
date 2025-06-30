import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Applications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resumes'); // Start with resumes tab since we have data there
  const [emailSubscribers, setEmailSubscribers] = useState([]);
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [rejectedCandidates, setRejectedCandidates] = useState([]);

  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const loadRealData = async () => {
      try {
        // Debug: Log what's in localStorage
        console.log('=== DEBUGGING RECRUITER DASHBOARD DATA ===');
        console.log('emailSubscribers:', localStorage.getItem('emailSubscribers'));
        console.log('uploadedResumes:', localStorage.getItem('uploadedResumes'));
        console.log('jobApplications:', localStorage.getItem('jobApplications'));

        // Load email subscribers from localStorage
        const subscribers = JSON.parse(localStorage.getItem('emailSubscribers') || '[]');
        console.log('Parsed subscribers:', subscribers);

        // Fix subscriber data structure
        const fixedSubscribers = subscribers.map((sub, index) => ({
          id: sub.id || index,
          email: sub.email || sub,
          userName: sub.userName || sub.name || 'Anonymous User',
          subscribedAt: sub.subscribedAt || sub.subscribedDate || sub.date || new Date().toISOString()
        }));
        setEmailSubscribers(fixedSubscribers);

        // Load uploaded resumes from localStorage
        const resumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');
        console.log('Parsed resumes:', resumes);
        setUploadedResumes(resumes);

        // Load shortlisted candidates from localStorage
        const shortlisted = JSON.parse(localStorage.getItem('shortlistedCandidates') || '[]');
        console.log('Parsed shortlisted candidates:', shortlisted);
        setShortlistedCandidates(shortlisted);

        // Load rejected candidates from localStorage
        const rejected = JSON.parse(localStorage.getItem('rejectedCandidates') || '[]');
        console.log('Parsed rejected candidates:', rejected);
        setRejectedCandidates(rejected);

        // Load ONLY real job applications from localStorage (no mock data)
        const jobApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        console.log('Parsed job applications:', jobApps);

        // Convert real applications to proper format
        const realApplications = jobApps.map((app, index) => ({
          id: app.id || `app_${Date.now()}_${index}`,
          jobTitle: app.jobTitle || 'Unknown Position',
          jobId: app.jobId || 'unknown',
          candidateName: app.candidateName || 'Unknown Candidate',
          candidateEmail: app.candidateEmail || 'No email provided',
          phone: app.phone || 'Not provided',
          appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: app.status || 'pending',
          experience: app.experience || 'Not specified',
          resume: app.resume || 'No resume uploaded',
          coverLetter: app.coverLetter || 'No cover letter provided',
          skills: app.skills ? (Array.isArray(app.skills) ? app.skills : app.skills.split(',').map(s => s.trim())) : [],
          whyHireYou: app.whyHireYou || 'Not provided',
          portfolio: app.portfolio || 'Not provided',
          githubUrl: app.githubUrl || 'Not provided',
          expectedSalary: app.expectedSalary || 'Not specified',
          companyName: app.companyName || 'Unknown Company'
        }));

        console.log('Processed applications:', realApplications);
        setApplications(realApplications);

        // If no real data exists, let's add a note about how to get data
        if (realApplications.length === 0 && fixedSubscribers.length === 0 && resumes.length === 0) {
          console.log('=== NO REAL DATA FOUND ===');
          console.log('To see real data in recruiter dashboard:');
          console.log('1. Students need to apply for jobs');
          console.log('2. Users need to subscribe to newsletter');
          console.log('3. Students need to upload resumes');
          console.log('Current localStorage contents:');
          console.log('- jobApplications:', localStorage.getItem('jobApplications'));
          console.log('- emailSubscribers:', localStorage.getItem('emailSubscribers'));
          console.log('- uploadedResumes:', localStorage.getItem('uploadedResumes'));
        }

        // Also try to fetch from backend API if available
        try {
          const response = await fetch(`http://localhost:3000/job-applications/${user?.email}`);
          if (response.ok) {
            const apiApplications = await response.json();
            console.log('API applications:', apiApplications);
            if (apiApplications.length > 0) {
              // Merge API data with localStorage data
              const mergedApplications = [...realApplications, ...apiApplications];
              setApplications(mergedApplications);
            }
          }
        } catch (apiError) {
          console.log('API not available, using localStorage data');
        }

      } catch (error) {
        console.error('Error loading real data:', error);
      }
    };

    loadRealData();
  }, [user]);

  // Get unique job titles for filter
  const jobTitles = [...new Set(applications.map(app => app.jobTitle))];

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const jobMatch = selectedJob === 'all' || app.jobTitle === selectedJob;
    const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
    return jobMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (applicationId, newStatus) => {
    // Update the applications state
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    // Save updated status to localStorage
    try {
      const jobApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      const updatedJobApps = jobApps.map(app => {
        // Find matching application by email and job details
        const matchingApp = updatedApplications.find(updatedApp =>
          updatedApp.candidateEmail === app.candidateEmail &&
          updatedApp.jobId === app.jobId
        );
        if (matchingApp) {
          return { ...app, status: newStatus };
        }
        return app;
      });
      localStorage.setItem('jobApplications', JSON.stringify(updatedJobApps));

      // Show success message
      alert(`Application status updated to: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const statusOptions = ['pending', 'shortlisted', 'rejected', 'hired'];

  // Function to handle viewing resume
  const handleViewResume = (application) => {
    // Check for new resume file format (from job application form)
    if (application.resumeFile && application.resumeFileName) {
      // Create a blob from the base64 data and open it
      try {
        const base64Data = application.resumeFile.split(',')[1]; // Remove data:application/pdf;base64, prefix
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Open in new tab
        const newWindow = window.open(url, '_blank');
        if (newWindow) {
          newWindow.document.title = `Resume - ${application.candidateName}`;
        }

        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error('Error opening resume:', error);
        alert('Error opening resume file. Please try again.');
      }
    }
    // Check for old resume format (legacy)
    else if (application.resume && application.resume !== 'No resume uploaded') {
      // If it's a file URL or base64, try to open it
      if (application.resume.startsWith('data:') || application.resume.startsWith('http')) {
        window.open(application.resume, '_blank');
      } else {
        alert(`Resume file: ${application.resume}\nCandidate: ${application.candidateName}\nEmail: ${application.candidateEmail}`);
      }
    } else {
      alert(`No resume available for this candidate.\n\nCandidate: ${application.candidateName}\nEmail: ${application.candidateEmail}\n\nPlease ask the candidate to reapply with their resume attached.`);
    }
  };

  // Function to download resume
  const handleDownloadResume = (application) => {
    if (application.resumeFile && application.resumeFileName) {
      try {
        // Create a blob from the base64 data
        const base64Data = application.resumeFile.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${application.candidateName}_${application.resumeFileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Error downloading resume file. Please try again.');
      }
    } else {
      alert('Resume file not available for download.');
    }
  };

  // Function to contact candidate
  const handleContactCandidate = (application) => {
    const subject = `Regarding your application for ${application.jobTitle}`;
    const body = `Dear ${application.candidateName},\n\nThank you for your application for the ${application.jobTitle} position.\n\nBest regards,\n${user?.name || 'Hiring Team'}`;
    const mailtoLink = `mailto:${application.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Function to add test data for demonstration
  const addTestData = () => {
    const testApplication = {
      id: `test_${Date.now()}`,
      jobId: 'test_job_1',
      candidateEmail: 'test.student@example.com',
      candidateName: 'Test Student',
      jobTitle: 'Frontend Developer',
      companyName: 'Test Company',
      appliedAt: new Date().toISOString(),
      status: 'pending',
      experience: '2 years',
      skills: 'React, JavaScript, CSS',
      coverLetter: 'I am very interested in this position and believe my skills would be a great fit.',
      whyHireYou: 'I have strong technical skills and am eager to learn.',
      portfolio: 'https://testportfolio.com',
      githubUrl: 'https://github.com/teststudent',
      expectedSalary: '50000'
    };

    const testSubscriber = {
      email: 'test.subscriber@example.com',
      userName: 'Test Subscriber',
      subscribedAt: new Date().toISOString()
    };

    const testResume = {
      fileName: 'test_resume.pdf',
      userName: 'Test Student',
      userEmail: 'test.student@example.com',
      uploadDate: new Date().toISOString(),
      fileSize: 1024000,
      fileData: 'data:application/pdf;base64,test-data'
    };

    // Add to localStorage
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const subscribers = JSON.parse(localStorage.getItem('emailSubscribers') || '[]');
    const resumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');

    applications.push(testApplication);
    subscribers.push(testSubscriber);
    resumes.push(testResume);

    localStorage.setItem('jobApplications', JSON.stringify(applications));
    localStorage.setItem('emailSubscribers', JSON.stringify(subscribers));
    localStorage.setItem('uploadedResumes', JSON.stringify(resumes));

    // Reload data
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
            <p className="text-gray-600">Manage applications, subscribers, and resumes</p>
          </div>

          {/* Test Data Button - Only show if no real data exists */}
          {applications.length === 0 && emailSubscribers.length === 0 && uploadedResumes.length === 0 && (
            <div className="text-right">
              <button
                onClick={addTestData}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🧪 Add Test Data
              </button>
              <p className="text-xs text-gray-500 mt-1">For demonstration purposes</p>
            </div>
          )}
        </div>

        {/* Real Data Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800">Total Applications</h3>
            <p className="text-2xl font-bold text-indigo-600">{applications.length}</p>
            <p className="text-sm text-indigo-600">Real applications received</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800">Shortlisted</h3>
            <p className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'shortlisted').length + shortlistedCandidates.length}
            </p>
            <p className="text-sm text-green-600">Candidates shortlisted</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800">Email Subscribers</h3>
            <p className="text-2xl font-bold text-purple-600">{emailSubscribers.length}</p>
            <p className="text-sm text-purple-600">Newsletter subscribers</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800">Resumes Uploaded</h3>
            <p className="text-2xl font-bold text-orange-600">{uploadedResumes.length}</p>
            <p className="text-sm text-orange-600">Direct resume uploads</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{rejectedCandidates.length}</p>
            <p className="text-sm text-red-600">Candidates rejected</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Job Applications ({filteredApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Subscribers ({emailSubscribers.length})
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resumes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Uploaded Resumes ({uploadedResumes.length})
            </button>
            <button
              onClick={() => setActiveTab('shortlisted')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shortlisted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shortlisted ({shortlistedCandidates.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected ({rejectedCandidates.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Jobs</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>

          <div className="ml-auto">
            <div className="text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          {filteredApplications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{application.candidateName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="text-blue-600 font-medium mb-2">{application.jobTitle}</div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>📧 {application.candidateEmail}</span>
                    <span>📞 {application.phone}</span>
                    <span>💼 {application.experience} experience</span>
                    <span>📅 Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                    {(application.resumeFile || application.resume) && (
                      <span className="text-green-600 font-medium">📄 Resume Attached</span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Skills: </span>
                    <div className="inline-flex flex-wrap gap-1 mt-1">
                      {application.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {application.coverLetter && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Cover Letter: </span>
                      {application.coverLetter.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewResume(application)}
                      className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50 transition-colors"
                    >
                      👁️ View Resume
                    </button>
                    {(application.resumeFile || application.resume) && (
                      <button
                        onClick={() => handleDownloadResume(application)}
                        className="px-3 py-1 text-purple-600 border border-purple-600 rounded text-sm hover:bg-purple-50 transition-colors"
                      >
                        📥 Download
                      </button>
                    )}
                    <button
                      onClick={() => handleContactCandidate(application)}
                      className="px-3 py-1 text-green-600 border border-green-600 rounded text-sm hover:bg-green-50 transition-colors"
                    >
                      💬 Contact
                    </button>
                  </div>
                  
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              {applications.length === 0
                ? "No real applications received yet. This dashboard shows actual student applications, not mock data."
                : "No applications match your current filters."
              }
            </p>
            {applications.length === 0 && (
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Post a Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'shortlisted').length}
          </div>
          <div className="text-sm text-gray-600">Shortlisted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === 'hired').length}
          </div>
          <div className="text-sm text-gray-600">Hired</div>
        </div>
      </div>
        </>
      )}

      {/* Email Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Email Subscribers</h2>
            {emailSubscribers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No email subscribers yet</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emailSubscribers.map((subscriber, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.userName || 'Anonymous'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Resumes Tab */}
      {activeTab === 'resumes' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Uploaded Resumes</h2>
              {uploadedResumes.some(resume => !resume.fileData) && (
                <button
                  onClick={() => {
                    if (confirm('Remove all resumes without file data? This will clean up old entries that cannot be downloaded.')) {
                      const validResumes = uploadedResumes.filter(resume => resume.fileData);
                      setUploadedResumes(validResumes);
                      localStorage.setItem('uploadedResumes', JSON.stringify(validResumes));
                      alert('Cleaned up resumes without file data');
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  🧹 Clean Up Old Resumes
                </button>
              )}
            </div>
            {uploadedResumes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No resumes uploaded yet</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {uploadedResumes.map((resume, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                        <p className="text-sm text-gray-600">Uploaded by: {resume.userName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">Email: {resume.userEmail}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size: {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {!resume.fileData && (
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                            ⚠️ File content not available. This resume was uploaded before file storage was implemented.
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (resume.fileData) {
                                window.open(resume.fileData, '_blank');
                              } else {
                                alert('Resume preview not available');
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            📄 View
                          </button>
                          <button
                            onClick={() => {
                              console.log('Download clicked for resume:', resume);
                              if (resume.fileData) {
                                try {
                                  const link = document.createElement('a');
                                  link.href = resume.fileData;
                                  link.download = resume.fileName || 'resume.pdf';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } catch (error) {
                                  console.error('Download error:', error);
                                  alert('Error downloading resume. Please try again.');
                                }
                              } else {
                                alert(`This resume was uploaded before file storage was implemented. Please ask the candidate to re-upload their resume.\n\nCandidate: ${resume.userName}\nEmail: ${resume.userEmail}`);
                                console.log('Resume object:', resume);
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            💾 Download
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              console.log('Contact clicked for:', resume.userEmail);
                              if (!resume.userEmail || resume.userEmail === 'undefined' || resume.userEmail === 'anonymous') {
                                alert(`Email address not available for this candidate.\n\nCandidate: ${resume.userName}\nPlease ask them to provide their email address.`);
                                return;
                              }

                              // Show contact options dialog
                              const subject = `Job Opportunity - ${user?.name || 'Our Company'}`;
                              const body = `Dear ${resume.userName || 'Candidate'},\n\nWe reviewed your resume and are interested in discussing potential opportunities with you.\n\nBest regards,\n${user?.name || 'Hiring Team'}`;

                              const contactOptions = `
📧 CONTACT OPTIONS FOR: ${resume.userName}
Email: ${resume.userEmail}

OPTION 1: Open Email Client (Automatic)
- Click OK to open your email app (Outlook, Gmail, etc.)
- Email will be pre-written and ready to send

OPTION 2: Manual Contact
- Copy the email address: ${resume.userEmail}
- Open your email manually (Gmail.com, Outlook.com, etc.)
- Send your own message

OPTION 3: Copy Pre-written Message
Subject: ${subject}

Message:
${body}

Choose OK to try opening your email client, or Cancel to copy the details manually.`;

                              if (confirm(contactOptions)) {
                                try {
                                  // Try to open email client
                                  const mailtoLink = `mailto:${resume.userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                  window.location.href = mailtoLink;

                                  // Show success message
                                  setTimeout(() => {
                                    alert(`✅ Email client should have opened!\n\nIf it didn't work:\n1. Go to Gmail.com or your email provider\n2. Send email to: ${resume.userEmail}\n3. Use the pre-written message above`);
                                  }, 1000);

                                } catch (error) {
                                  console.error('Contact error:', error);
                                  alert(`❌ Email client failed to open.\n\nMANUAL CONTACT INFO:\nEmail: ${resume.userEmail}\nName: ${resume.userName}\n\nGo to Gmail.com or your email provider and send them a message.`);
                                }
                              } else {
                                // User chose to copy manually
                                navigator.clipboard.writeText(resume.userEmail).then(() => {
                                  alert(`📋 Email address copied to clipboard!\n\nEmail: ${resume.userEmail}\n\nNow go to Gmail.com or your email provider and paste the email address.`);
                                }).catch(() => {
                                  alert(`📧 MANUAL CONTACT INFO:\nEmail: ${resume.userEmail}\nName: ${resume.userName}\n\nCopy this email address and use it in your email provider.`);
                                });
                              }
                            }}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                          >
                            ✉️ Contact
                          </button>
                          <button
                            onClick={() => {
                              // Add to shortlisted candidates
                              const shortlisted = JSON.parse(localStorage.getItem('shortlistedCandidates') || '[]');
                              const candidate = {
                                id: `shortlist_${Date.now()}`,
                                name: resume.userName,
                                email: resume.userEmail,
                                resume: resume.fileName,
                                shortlistedAt: new Date().toISOString(),
                                source: 'direct_resume_upload'
                              };

                              // Check if already shortlisted
                              const alreadyShortlisted = shortlisted.some(c => c.email === resume.userEmail);
                              if (alreadyShortlisted) {
                                alert('Candidate already shortlisted!');
                                return;
                              }

                              shortlisted.push(candidate);
                              localStorage.setItem('shortlistedCandidates', JSON.stringify(shortlisted));

                              // Update state immediately
                              setShortlistedCandidates(shortlisted);

                              alert(`${resume.userName} has been shortlisted!`);
                            }}
                            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                          >
                            ⭐ Shortlist
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to reject ${resume.userName}?`)) {
                                // Add to rejected candidates
                                const rejected = JSON.parse(localStorage.getItem('rejectedCandidates') || '[]');
                                const candidate = {
                                  id: `reject_${Date.now()}`,
                                  name: resume.userName,
                                  email: resume.userEmail,
                                  resume: resume.fileName,
                                  rejectedAt: new Date().toISOString(),
                                  source: 'direct_resume_upload'
                                };

                                rejected.push(candidate);
                                localStorage.setItem('rejectedCandidates', JSON.stringify(rejected));

                                // Update state immediately
                                setRejectedCandidates(rejected);

                                alert(`${resume.userName} has been rejected.`);
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shortlisted Candidates Tab */}
      {activeTab === 'shortlisted' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shortlisted Candidates</h2>
            {shortlistedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Shortlisted Candidates</h3>
                <p className="text-gray-600">Candidates you shortlist will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {shortlistedCandidates.map((candidate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                          ⭐ {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">Email: {candidate.email}</p>
                        <p className="text-sm text-gray-600">Resume: {candidate.resume}</p>
                        <p className="text-sm text-gray-500">
                          Shortlisted: {new Date(candidate.shortlistedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Source: {candidate.source === 'direct_resume_upload' ? 'Resume Upload' : 'Job Application'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const subject = `Congratulations! You've been shortlisted - ${user?.name || 'Our Company'}`;
                            const body = `Dear ${candidate.name},\n\nWe are pleased to inform you that you have been shortlisted for a position with us. We were impressed with your qualifications and would like to discuss the next steps.\n\nBest regards,\n${user?.name || 'Hiring Team'}`;

                            if (confirm(`📧 Contact ${candidate.name}?\n\nEmail: ${candidate.email}\n\nClick OK to open email client or Cancel to copy email address.`)) {
                              try {
                                const mailtoLink = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                window.location.href = mailtoLink;
                                setTimeout(() => {
                                  alert(`✅ Email client opened for shortlisted candidate!\n\nIf it didn't work, manually email: ${candidate.email}`);
                                }, 1000);
                              } catch (error) {
                                alert(`❌ Email client failed.\n\nManually contact:\nEmail: ${candidate.email}\nName: ${candidate.name}`);
                              }
                            } else {
                              navigator.clipboard.writeText(candidate.email).then(() => {
                                alert(`📋 Email copied: ${candidate.email}`);
                              }).catch(() => {
                                alert(`📧 Email: ${candidate.email}`);
                              });
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          📧 Contact
                        </button>
                        <button
                          onClick={() => {
                            const updated = shortlistedCandidates.filter((_, i) => i !== index);
                            setShortlistedCandidates(updated);
                            localStorage.setItem('shortlistedCandidates', JSON.stringify(updated));
                            alert('Candidate removed from shortlist');
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejected Candidates Tab */}
      {activeTab === 'rejected' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rejected Candidates</h2>
            {rejectedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rejected Candidates</h3>
                <p className="text-gray-600">Candidates you reject will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {rejectedCandidates.map((candidate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                          ❌ {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">Email: {candidate.email}</p>
                        <p className="text-sm text-gray-600">Resume: {candidate.resume}</p>
                        <p className="text-sm text-gray-500">
                          Rejected: {new Date(candidate.rejectedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Source: {candidate.source === 'direct_resume_upload' ? 'Resume Upload' : 'Job Application'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const updated = rejectedCandidates.filter((_, i) => i !== index);
                            setRejectedCandidates(updated);
                            localStorage.setItem('rejectedCandidates', JSON.stringify(updated));
                            alert('Candidate removed from rejected list');
                          }}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

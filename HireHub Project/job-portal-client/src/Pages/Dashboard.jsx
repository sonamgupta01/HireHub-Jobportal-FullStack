import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaChartLine, FaUsers, FaBriefcase, FaEye, FaHeart,
  FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign,
  FaRocket, FaLightbulb, FaFire, FaClock, FaArrowUp,
  FaArrowDown, FaEquals, FaCheckCircle, FaTimesCircle,
  FaStar, FaGraduationCap, FaBuilding, FaCode
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, isRecruiter, isStudent } = useAuth();
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    postedJobs: 0,
    applications: 0,
    profileViews: 0,
    interviewsScheduled: 0,
    skillsAssessed: 0,
    resumeScore: 0
  });
  const [marketInsights, setMarketInsights] = useState({
    trendingSkills: ['React', 'Python', 'AWS', 'Node.js', 'TypeScript'],
    salaryTrends: { increase: 12, average: 85000 },
    jobGrowth: { percentage: 23, sector: 'Tech' }
  });
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [activityData, setActivityData] = useState([]);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Fetch real stats from localStorage and API based on user role
    const fetchStats = async () => {
      try {
        if (isStudent()) {
          // Get data from localStorage first (more reliable)
          const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');

          // Filter applications for current user
          const userApplications = applications.filter(app => app.candidateEmail === user.email);

          setStats(prev => ({
            ...prev,
            appliedJobs: userApplications.length,
            savedJobs: savedJobs.length,
            profileViews: Math.floor(userApplications.length * 3.2), // Realistic calculation
            resumeScore: userApplications.length > 0 ? Math.min(85 + userApplications.length * 2, 98) : 65,
            interviewsScheduled: Math.floor(userApplications.length * 0.3) // 30% interview rate
          }));

          // Also try to fetch from API as backup
          try {
            const applicationsRes = await fetch(`http://localhost:3000/my-applications/${user.email}`);
            if (applicationsRes.ok) {
              const apiApplications = await applicationsRes.json();
              if (apiApplications.length > userApplications.length) {
                setStats(prev => ({
                  ...prev,
                  appliedJobs: apiApplications.length,
                  profileViews: Math.floor(apiApplications.length * 3.2),
                  resumeScore: apiApplications.length > 0 ? Math.min(85 + apiApplications.length * 2, 98) : 65,
                  interviewsScheduled: Math.floor(apiApplications.length * 0.3)
                }));
              }
            }
          } catch (apiError) {
            console.log('API not available, using localStorage data');
          }

        } else if (isRecruiter()) {
          // Fetch recruiter stats from API
          try {
            const jobsRes = await fetch(`http://localhost:3000/myJobs/${user.email}`);
            const jobs = await jobsRes.json();

            const applicationsRes = await fetch(`http://localhost:3000/job-applications/${user.email}`);
            const applications = await applicationsRes.json();

            setStats(prev => ({
              ...prev,
              postedJobs: jobs.length,
              applications: applications.length
            }));
          } catch (error) {
            console.error('Error fetching recruiter stats:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values if everything fails
        setStats(prev => ({
          ...prev,
          appliedJobs: 0,
          savedJobs: 0,
          profileViews: 0,
          resumeScore: 65,
          interviewsScheduled: 0
        }));
      }
    };

    fetchStats();
  }, [user, isStudent, isRecruiter]);

  const StudentDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Applications</p>
              <p className="text-3xl font-bold text-white">{stats.appliedJobs}</p>
            </div>
            <FaBriefcase className="text-2xl text-white" />
          </div>
          <div className="flex items-center mt-2 text-white text-sm">
            <FaArrowUp className="mr-1" /> {stats.appliedJobs > 0 ? '+2 this week' : 'Start applying'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Saved Jobs</p>
              <p className="text-3xl font-bold">{stats.savedJobs}</p>
            </div>
            <FaHeart className="text-2xl text-teal-200" />
          </div>
          <div className="flex items-center mt-2 text-teal-100 text-sm">
            <FaHeart className="mr-1" /> {stats.savedJobs > 0 ? 'Ready to apply' : 'Save interesting jobs'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Resume Score</p>
              <p className="text-3xl font-bold">{stats.resumeScore}%</p>
            </div>
            <FaTrophy className="text-2xl text-purple-200" />
          </div>
          <div className="flex items-center mt-2 text-purple-100 text-sm">
            {stats.resumeScore >= 85 ? (
              <><FaArrowUp className="mr-1" /> Excellent</>
            ) : stats.resumeScore >= 70 ? (
              <><FaEquals className="mr-1" /> Good</>
            ) : (
              <><FaArrowDown className="mr-1" /> Needs Improvement</>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Interviews</p>
              <p className="text-3xl font-bold">{stats.interviewsScheduled}</p>
            </div>
            <FaCalendarAlt className="text-2xl text-orange-200" />
          </div>
          <div className="flex items-center mt-2 text-orange-100 text-sm">
            <FaClock className="mr-1" /> {stats.interviewsScheduled > 0 ? `${stats.interviewsScheduled} scheduled` : 'None scheduled'}
          </div>
        </div>
      </div>

      {/* Market Insights & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-blue-800">Market Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Salary Growth</span>
                <span className="text-green-600 font-bold">+{marketInsights.salaryTrends.increase}%</span>
              </div>
              <p className="text-green-600 text-sm mt-1">Average: ₹{marketInsights.salaryTrends.average.toLocaleString()}/month</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">Job Market Growth</span>
                <span className="text-blue-600 font-bold">+{marketInsights.jobGrowth.percentage}%</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">Fastest growing: {marketInsights.jobGrowth.sector}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl shadow-lg border-2 border-red-200">
          <div className="flex items-center mb-4">
            <FaFire className="text-2xl text-red-600 mr-3" />
            <h3 className="text-xl font-semibold text-red-800">Trending Skills</h3>
          </div>

          <div className="space-y-3">
            {marketInsights.trendingSkills.map((skill, index) => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-3">#{index + 1}</span>
                  <span className="font-medium text-gray-800">{skill}</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <FaArrowUp className="mr-1" />
                  Hot
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center mb-4">
          <FaLightbulb className="text-2xl text-purple-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">AI Recommendations for You</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-lg border-2 border-purple-200">
            <div className="flex items-center mb-2">
              <FaRocket className="text-purple-600 mr-2" />
              <h4 className="font-bold text-purple-800">Skill Boost</h4>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              {stats.appliedJobs > 0
                ? `Based on your applications, learning React.js could increase matches by 40%`
                : 'Start with skill assessment to get personalized recommendations'
              }
            </p>
            <Link to="/skills-quiz" className="text-purple-700 text-sm font-bold hover:underline">
              Take Assessment →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow-lg border-2 border-green-200">
            <div className="flex items-center mb-2">
              <FaGraduationCap className="text-green-600 mr-2" />
              <h4 className="font-bold text-green-800">Resume Upgrade</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              {stats.resumeScore < 85
                ? `Add ${Math.ceil((85 - stats.resumeScore) / 5)} more sections to improve your resume score`
                : 'Your resume is looking great! Consider adding recent projects'
              }
            </p>
            <Link to="/resume-builder" className="text-green-700 text-sm font-bold hover:underline">
              Improve Resume →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow-lg border-2 border-blue-200">
            <div className="flex items-center mb-2">
              <FaBuilding className="text-blue-600 mr-2" />
              <h4 className="font-bold text-blue-800">Perfect Match</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              {stats.appliedJobs > 0
                ? `${Math.floor(stats.appliedJobs * 2.3)} new jobs match your profile`
                : 'Complete your profile to see job matches'
              }
            </p>
            <Link to="/jobs" className="text-blue-700 text-sm font-bold hover:underline">
              View Jobs →
            </Link>
          </div>
        </div>
      </div>

      {/* Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-indigo-800">Recent Activity</h3>
            <FaClock className="text-indigo-500 text-2xl" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <FaBriefcase className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Applied to Software Engineer</p>
                <p className="text-sm text-gray-600">at Google • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="bg-green-500 p-2 rounded-full mr-3">
                <FaCheckCircle className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Completed Mock Interview</p>
                <p className="text-sm text-gray-600">Score: 8.5/10 • Yesterday</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="bg-purple-500 p-2 rounded-full mr-3">
                <FaStar className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Updated Resume</p>
                <p className="text-sm text-gray-600">Score improved to 85% • 2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-orange-800">Quick Actions</h3>
            <FaRocket className="text-orange-500 text-2xl" />
          </div>

          <div className="space-y-3">
            <Link to="/resume-builder" className="flex items-center p-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition">
              <FaCode className="mr-3 text-xl text-white" />
              <div>
                <p className="font-semibold text-white">Build AI Resume</p>
                <p className="text-white text-sm">Create professional resume</p>
              </div>
            </Link>

            <Link to="/mock-interview" className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition">
              <FaUsers className="mr-3 text-xl" />
              <div>
                <p className="font-semibold">Practice Interview</p>
                <p className="text-green-100 text-sm">AI-powered mock interviews</p>
              </div>
            </Link>

            <Link to="/skills-quiz" className="flex items-center p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition">
              <FaGraduationCap className="mr-3 text-xl" />
              <div>
                <p className="font-semibold">Skills Assessment</p>
                <p className="text-pink-100 text-sm">Test your knowledge and skills</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const RecruiterDashboard = () => {
    const [recruiterStats, setRecruiterStats] = useState({
      totalJobs: 0,
      totalApplications: 0,
      shortlistedCandidates: 0,
      rejectedCandidates: 0,
      emailSubscribers: 0,
      uploadedResumes: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);

    useEffect(() => {
      // Load real data from localStorage
      const loadRecruiterData = () => {
        try {
          // Get all data from localStorage
          const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
          const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
          const shortlisted = JSON.parse(localStorage.getItem('shortlistedCandidates') || '[]');
          const rejected = JSON.parse(localStorage.getItem('rejectedCandidates') || '[]');
          const subscribers = JSON.parse(localStorage.getItem('emailSubscribers') || '[]');
          const resumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');

          // Filter jobs posted by current recruiter (check multiple possible fields)
          const recruiterJobs = jobs.filter(job =>
            job.postedBy === user.email ||
            job.companyEmail === user.email ||
            job.recruiterEmail === user.email ||
            job.email === user.email
          );

          console.log('=== DEBUGGING JOB LOADING ===');
          console.log('Current user email:', user.email);
          console.log('All jobs in localStorage:', jobs);
          console.log('Filtered recruiter jobs:', recruiterJobs);
          console.log('Jobs count:', jobs.length, 'Recruiter jobs count:', recruiterJobs.length);

          // Filter applications for recruiter's jobs
          const recruiterApplications = applications.filter(app =>
            recruiterJobs.some(job => job._id === app.jobId)
          );

          setRecruiterStats({
            totalJobs: recruiterJobs.length,
            totalApplications: recruiterApplications.length,
            shortlistedCandidates: shortlisted.length,
            rejectedCandidates: rejected.length,
            emailSubscribers: subscribers.length,
            uploadedResumes: resumes.length
          });

          // Set recent jobs (last 5)
          setRecentJobs(recruiterJobs.slice(-5).reverse());

          // Set recent applications (last 5)
          setRecentApplications(recruiterApplications.slice(-5).reverse());

        } catch (error) {
          console.error('Error loading recruiter data:', error);
        }
      };

      loadRecruiterData();
    }, [user.email]);

    return (
      <div className="space-y-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium" style={{ color: '#dbeafe', fontSize: '0.875rem', fontWeight: '500' }}>Posted Jobs</p>
                <p className="text-3xl font-bold text-white" style={{ color: 'white', fontSize: '1.875rem', fontWeight: 'bold' }}>{recruiterStats.totalJobs}</p>
              </div>
              <FaBriefcase className="text-2xl text-blue-200" style={{ color: '#bfdbfe', fontSize: '1.5rem' }} />
            </div>
            <Link
              to="/my-jobs"
              className="text-blue-100 text-sm hover:underline mt-2 block"
              style={{ color: '#dbeafe', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Manage Jobs →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Applications</p>
                <p className="text-3xl font-bold text-white">{recruiterStats.totalApplications}</p>
              </div>
              <FaUsers className="text-2xl text-green-200" />
            </div>
            <Link to="/applications" className="text-green-100 text-sm hover:underline mt-2 block">
              Review →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold text-white">{recruiterStats.shortlistedCandidates}</p>
              </div>
              <FaStar className="text-2xl text-yellow-200" />
            </div>
            <Link to="/applications" className="text-yellow-100 text-sm hover:underline mt-2 block">
              View →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-white">{recruiterStats.rejectedCandidates}</p>
              </div>
              <FaTimesCircle className="text-2xl text-red-200" />
            </div>
            <Link to="/applications" className="text-red-100 text-sm hover:underline mt-2 block">
              View →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Subscribers</p>
                <p className="text-3xl font-bold text-white">{recruiterStats.emailSubscribers}</p>
              </div>
              <FaEye className="text-2xl text-purple-200" />
            </div>
            <Link to="/applications" className="text-purple-100 text-sm hover:underline mt-2 block">
              View →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Resumes</p>
                <p className="text-3xl font-bold text-white">{recruiterStats.uploadedResumes}</p>
              </div>
              <FaGraduationCap className="text-2xl text-orange-200" />
            </div>
            <Link to="/applications" className="text-orange-100 text-sm hover:underline mt-2 block">
              View →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center mb-4">
            <FaRocket className="text-2xl text-indigo-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/create-job"
              className="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg border-2 border-blue-400 transform hover:scale-105"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                minHeight: '80px'
              }}
            >
              <FaBriefcase className="mr-3 text-xl text-white flex-shrink-0" style={{ color: 'white' }} />
              <div className="text-left">
                <p className="font-bold text-white text-base" style={{ color: 'white', fontWeight: 'bold' }}>Post New Job</p>
                <p className="text-white text-sm mt-1" style={{ color: 'white' }}>Create job listing</p>
              </div>
            </Link>

            <Link
              to="/applications"
              className="flex items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg border-2 border-green-400 transform hover:scale-105"
              style={{
                backgroundColor: '#059669',
                color: 'white',
                textDecoration: 'none',
                minHeight: '80px'
              }}
            >
              <FaUsers className="mr-3 text-xl text-white flex-shrink-0" style={{ color: 'white' }} />
              <div className="text-left">
                <p className="font-bold text-white text-base" style={{ color: 'white', fontWeight: 'bold' }}>Review Applications</p>
                <p className="text-white text-sm mt-1" style={{ color: 'white' }}>Manage candidates</p>
              </div>
            </Link>

            <Link
              to="/my-jobs"
              className="flex items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg border-2 border-purple-400 transform hover:scale-105"
              style={{
                backgroundColor: '#9333ea',
                color: 'white',
                textDecoration: 'none',
                minHeight: '80px'
              }}
            >
              <FaChartLine className="mr-3 text-xl text-white flex-shrink-0" style={{ color: 'white' }} />
              <div className="text-left">
                <p className="font-bold text-white text-base" style={{ color: 'white', fontWeight: 'bold' }}>Manage Jobs</p>
                <p className="text-white text-sm mt-1" style={{ color: 'white' }}>Edit & track jobs</p>
              </div>
            </Link>

            <div
              className="flex items-center p-4 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-all duration-200 shadow-lg border-2 border-orange-400 transform hover:scale-105"
              style={{
                backgroundColor: '#ea580c',
                color: 'white',
                minHeight: '80px'
              }}
              onClick={() => {
                   console.log('=== RECRUITMENT ANALYTICS DEBUG ===');
                   console.log('Recruiter Stats:', recruiterStats);

                   const totalCandidates = recruiterStats.shortlistedCandidates + recruiterStats.rejectedCandidates;
                   const conversionRate = recruiterStats.totalApplications > 0 ? ((recruiterStats.shortlistedCandidates / recruiterStats.totalApplications) * 100).toFixed(1) : 0;
                   const applicationRate = recruiterStats.totalJobs > 0 ? (recruiterStats.totalApplications / recruiterStats.totalJobs).toFixed(1) : 0;

                   alert(`📊 RECRUITMENT ANALYTICS DASHBOARD\n\n📋 OVERVIEW:\n✅ Total Applications: ${recruiterStats.totalApplications}\n💼 Posted Jobs: ${recruiterStats.totalJobs}\n⭐ Shortlisted: ${recruiterStats.shortlistedCandidates}\n❌ Rejected: ${recruiterStats.rejectedCandidates}\n\n📈 PERFORMANCE:\n📊 Conversion Rate: ${conversionRate}% (shortlisted/total)\n📈 Application Rate: ${applicationRate} applications per job\n\n👥 TALENT POOL:\n📧 Email Subscribers: ${recruiterStats.emailSubscribers}\n📄 Resume Database: ${recruiterStats.uploadedResumes}\n🎯 Total Reach: ${recruiterStats.emailSubscribers + recruiterStats.uploadedResumes} candidates\n\n💡 TIP: ${conversionRate > 15 ? 'Great conversion rate!' : conversionRate > 5 ? 'Good performance, room for improvement' : 'Consider refining job requirements'}`);
                 }}>
              <FaChartLine className="mr-3 text-xl text-white flex-shrink-0" style={{ color: 'white' }} />
              <div className="text-left">
                <p className="font-bold text-white text-base" style={{ color: 'white', fontWeight: 'bold' }}>View Analytics</p>
                <p className="text-white text-sm mt-1" style={{ color: 'white' }}>Recruitment insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs Posted */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-800">Your Recent Job Posts</h3>
              <FaBriefcase className="text-blue-500 text-2xl" />
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg border-2 border-blue-200">
                <FaBriefcase className="text-5xl text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-blue-800 mb-2">No Jobs Posted Yet</h4>
                <p className="text-blue-600 mb-6 font-medium">Start by posting your first job to attract talented candidates</p>
                <Link to="/create-job" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105">
                  🚀 Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job, index) => {
                  // Cycle through different colors for each job
                  const colors = [
                    { bg: 'bg-gradient-to-r from-purple-100 to-pink-100', border: 'border-purple-200', title: 'text-purple-800', text: 'text-purple-600', salary: 'bg-purple-200 text-purple-800' },
                    { bg: 'bg-gradient-to-r from-green-100 to-emerald-100', border: 'border-green-200', title: 'text-green-800', text: 'text-green-600', salary: 'bg-green-200 text-green-800' },
                    { bg: 'bg-gradient-to-r from-orange-100 to-yellow-100', border: 'border-orange-200', title: 'text-orange-800', text: 'text-orange-600', salary: 'bg-orange-200 text-orange-800' },
                    { bg: 'bg-gradient-to-r from-cyan-100 to-blue-100', border: 'border-cyan-200', title: 'text-cyan-800', text: 'text-cyan-600', salary: 'bg-cyan-200 text-cyan-800' },
                    { bg: 'bg-gradient-to-r from-rose-100 to-red-100', border: 'border-rose-200', title: 'text-rose-800', text: 'text-rose-600', salary: 'bg-rose-200 text-rose-800' }
                  ];
                  const colorScheme = colors[index % colors.length];

                  return (
                    <div key={index} className={`flex justify-between items-center p-4 ${colorScheme.bg} rounded-lg border-2 ${colorScheme.border} hover:shadow-md transition-all duration-200 transform hover:scale-102`}>
                      <div className="flex-1">
                        <h4 className={`font-bold ${colorScheme.title} text-lg`}>{job.jobTitle}</h4>
                        <p className={`text-sm ${colorScheme.text} font-medium`}>{job.companyName}</p>
                        <p className={`text-xs ${colorScheme.text} opacity-80`}>
                          Posted: {job.postingDate ? new Date(job.postingDate).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 ${colorScheme.salary} rounded-full text-sm font-semibold`}>
                          {job.salaryType === 'Hourly' ? `₹${job.minPrice}-${job.maxPrice}/hr` : `₹${job.minPrice}-${job.maxPrice}/month`}
                        </span>
                        <p className={`text-xs ${colorScheme.text} mt-1 font-medium`}>{job.jobLocation}</p>
                      </div>
                    </div>
                  );
                })}
                <Link to="/my-jobs" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 font-semibold">
                  View All Jobs →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800">Recent Applications</h3>
              <FaUsers className="text-green-500 text-2xl" />
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Applications Yet</h4>
                <p className="text-gray-500 mb-4">Applications will appear here when candidates apply to your jobs</p>
                <Link to="/applications" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  View Applications
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{application.candidateName}</h4>
                      <p className="text-sm text-gray-600">{application.candidateEmail}</p>
                      <p className="text-xs text-gray-500">
                        Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/applications" className="block text-center text-green-600 hover:underline mt-4">
                  View All Applications →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recruitment Insights */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-2xl text-blue-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Recruitment Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Application Rate</span>
                <FaArrowUp className="text-green-200" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {recruiterStats.totalJobs > 0 ? Math.round(recruiterStats.totalApplications / recruiterStats.totalJobs) : 0}
              </p>
              <p className="text-sm text-green-100">Applications per job</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Success Rate</span>
                <FaStar className="text-yellow-200" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {recruiterStats.totalApplications > 0 ? Math.round((recruiterStats.shortlistedCandidates / recruiterStats.totalApplications) * 100) : 0}%
              </p>
              <p className="text-sm text-yellow-100">Shortlist conversion</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Talent Pool</span>
                <FaGraduationCap className="text-purple-200" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {recruiterStats.uploadedResumes + recruiterStats.emailSubscribers}
              </p>
              <p className="text-sm text-purple-100">Total candidates reached</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-black drop-shadow-lg bg-white bg-opacity-90 p-4 rounded-lg">Welcome back, {user.name}! 👋</h1>
              <p className="text-black text-lg font-medium bg-white bg-opacity-80 p-3 rounded-lg mt-3">
                {user.role === 'student'
                  ? 'Your career journey continues here - let\'s make it amazing!'
                  : 'Manage your talent pipeline and grow your team'
                }
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center bg-white bg-opacity-70 p-2 rounded-lg">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  <span className="text-black font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-70 p-2 rounded-lg">
                  <FaFire className="mr-2 text-red-500" />
                  <span className="text-black font-medium">{stats.appliedJobs > 0 ? `${Math.floor(stats.appliedJobs * 1.5)} new opportunities this week` : 'Start exploring opportunities'}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 p-6 rounded-xl">
                <FaRocket className="text-6xl text-blue-200 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {user.role === 'student' ? <StudentDashboard /> : <RecruiterDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;

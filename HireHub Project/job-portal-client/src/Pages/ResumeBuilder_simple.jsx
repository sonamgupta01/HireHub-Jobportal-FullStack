import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ResumeBuilder = () => {
  const { user, isStudent } = useAuth();
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    objective: '',
    education: '',
    experience: '',
    skills: '',
    projects: ''
  });

  if (!user || !isStudent()) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (section, value) => {
    if (section === 'personalInfo') {
      setResumeData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...value }
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const downloadResume = () => {
    const resumeContent = `
      ${resumeData.personalInfo.fullName}
      ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}
      ${resumeData.personalInfo.address}
      LinkedIn: ${resumeData.personalInfo.linkedin}
      GitHub: ${resumeData.personalInfo.github}
      Portfolio: ${resumeData.personalInfo.portfolio}
      
      OBJECTIVE:
      ${resumeData.objective}
      
      EDUCATION:
      ${resumeData.education}
      
      EXPERIENCE:
      ${resumeData.experience}
      
      SKILLS:
      ${resumeData.skills}
      
      PROJECTS:
      ${resumeData.projects}
    `;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'Resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📄 Resume Builder</h1>
          <p className="text-lg text-gray-600">Create your professional resume</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', { fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', { email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', { phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={resumeData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', { address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => handleInputChange('personalInfo', { linkedin: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="GitHub Profile"
                value={resumeData.personalInfo.github}
                onChange={(e) => handleInputChange('personalInfo', { github: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Portfolio Website"
                value={resumeData.personalInfo.portfolio}
                onChange={(e) => handleInputChange('personalInfo', { portfolio: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
          </div>

          {/* Objective */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Objective</h2>
            <textarea
              placeholder="Write your career objective..."
              value={resumeData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            <textarea
              placeholder="Enter your education details (degree, college, CGPA, year)..."
              value={resumeData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
            <textarea
              placeholder="Enter your work experience..."
              value={resumeData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <textarea
              placeholder="List your technical and soft skills..."
              value={resumeData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
            <textarea
              placeholder="Describe your projects with GitHub links..."
              value={resumeData.projects}
              onChange={(e) => handleInputChange('projects', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadResume}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📥 Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

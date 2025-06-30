import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ResumeBuilder = () => {
  const { user, isStudent } = useAuth();
  const resumeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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

  const downloadResume = async () => {
    setIsGenerating(true);

    try {
      // Dynamic import for jsPDF and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      if (resumeRef.current) {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple text download
      const resumeContent = generateTextResume();
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName || 'Resume'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTextResume = () => {
    return `
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
    `.trim();
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

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-semibold"
            >
              👁️ {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={downloadResume}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
            >
              {isGenerating ? '⏳ Generating...' : '📥 Download PDF'}
            </button>
          </div>
        </div>

        {/* Professional Resume Preview */}
        {showPreview && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📄 Resume Preview</h2>

            <div
              ref={resumeRef}
              className="bg-white p-8 shadow-lg max-w-4xl mx-auto"
              style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}
            >
              {/* Header */}
              <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-gray-600">
                  <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                  <p>{resumeData.personalInfo.address}</p>
                  <div className="flex justify-center gap-4 mt-2 text-sm">
                    {resumeData.personalInfo.linkedin && (
                      <span>LinkedIn: {resumeData.personalInfo.linkedin}</span>
                    )}
                    {resumeData.personalInfo.github && (
                      <span>GitHub: {resumeData.personalInfo.github}</span>
                    )}
                    {resumeData.personalInfo.portfolio && (
                      <span>Portfolio: {resumeData.personalInfo.portfolio}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Objective */}
              {resumeData.objective && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                    CAREER OBJECTIVE
                  </h2>
                  <p className="text-gray-700">{resumeData.objective}</p>
                </div>
              )}

              {/* Education */}
              {resumeData.education && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                    EDUCATION
                  </h2>
                  <div className="text-gray-700 whitespace-pre-line">{resumeData.education}</div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                    EXPERIENCE
                  </h2>
                  <div className="text-gray-700 whitespace-pre-line">{resumeData.experience}</div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                    SKILLS
                  </h2>
                  <div className="text-gray-700 whitespace-pre-line">{resumeData.skills}</div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">
                    PROJECTS
                  </h2>
                  <div className="text-gray-700 whitespace-pre-line">{resumeData.projects}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;

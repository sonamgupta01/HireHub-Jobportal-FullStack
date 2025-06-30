import React, { useState } from 'react'
import {FaEnvelopeOpenText,FaRocket} from "react-icons/fa6"
import { useAuth } from '../context/AuthContext'

const Newsletter = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleEmailSubscription = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // Store email subscription with more details
      const subscriberData = {
        email: email,
        subscribedAt: new Date().toISOString(),
        userEmail: user?.email || 'anonymous',
        userName: user?.name || 'Anonymous User'
      };

      // Store in localStorage (later we can send to backend)
      const subscribers = JSON.parse(localStorage.getItem('emailSubscribers') || '[]');
      const existingIndex = subscribers.findIndex(sub => sub.email === email);

      if (existingIndex === -1) {
        subscribers.push(subscriberData);
        localStorage.setItem('emailSubscribers', JSON.stringify(subscribers));

        // TODO: Send to backend endpoint for recruiters to access
        // await fetch('http://localhost:3000/subscribe-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(subscriberData)
        // });
      }

      setIsSubscribed(true);
      setEmail('');
      alert('Successfully subscribed! You will receive job alerts.');
    } catch (error) {
      alert('Failed to subscribe. Please try again.');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      alert('Please upload a PDF or DOC file');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setResumeFile(file);
    setUploading(true);

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = function(e) {
        const fileData = e.target.result; // This is the base64 data

        // Store resume info with actual file data for recruiters
        const resumeInfo = {
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          userEmail: user?.email || 'anonymous',
          userName: user?.name || 'Anonymous User',
          fileType: file.type,
          fileData: fileData, // Store the actual file content as base64
          id: Date.now() // Simple ID for now
        };

        // Store in localStorage (later we can send to backend)
        const resumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');
        resumes.push(resumeInfo);
        localStorage.setItem('uploadedResumes', JSON.stringify(resumes));

        console.log('Resume uploaded with file data:', resumeInfo.fileName);

        // TODO: Send to backend endpoint for recruiters to access
        // const formData = new FormData();
        // formData.append('resume', file);
        // formData.append('userInfo', JSON.stringify(resumeInfo));
        // await fetch('http://localhost:3000/upload-resume', {
        //   method: 'POST',
        //   body: formData
        // });

        setUploading(false);
        alert('Resume uploaded successfully! Recruiters can now find you easier.');
      };

      reader.onerror = function() {
        setUploading(false);
        alert('Failed to read file. Please try again.');
      };

      // Read file as data URL (base64)
      reader.readAsDataURL(file);

    } catch (error) {
      setUploading(false);
      alert('Failed to upload resume. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
        {/* Email Subscription Section */}
        <div className="bg-white p-4 rounded-lg border">
        <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
            <FaEnvelopeOpenText className="text-blue-600"/>
            Email me for jobs</h3>
            <p className='text-gray-600 text-sm mb-4'>Get notified about new job opportunities that match your profile.</p>

            <form onSubmit={handleEmailSubscription} className='w-full space-y-3'>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" 
                  className='w-full block py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <button 
                  type="submit" 
                  className='w-full block py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition'
                >
                  {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                </button>
            </form>
        </div>
        
        {/* Resume Upload Section */}
        <div className="bg-white p-4 rounded-lg border">
            <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
                <FaRocket className="text-green-600"/>
                Get noticed faster
            </h3>
            
            <p className='text-gray-600 text-sm mb-4'>Upload your resume to let recruiters find you easily.</p>

            <div className='w-full space-y-3'>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleResumeUpload}
                  className='w-full block py-2 px-3 border border-gray-300 rounded focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                />
                {uploading && (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-blue-600">Uploading...</span>
                  </div>
                )}
                {resumeFile && !uploading && (
                  <div className="text-sm text-green-600">
                    ✓ {resumeFile.name} uploaded successfully
                  </div>
                )}
            </div>
        </div>
    </div>

    

  )
}

export default Newsletter

import React from 'react'
import { FaUsers, FaBriefcase, FaRocket, FaHandshake, FaGraduationCap, FaAward } from 'react-icons/fa'

const About = () => {
  const features = [
    {
      icon: <FaBriefcase className="w-8 h-8 text-blue-600" />,
      title: "Job Matching",
      description: "Our AI-powered algorithm matches students with the perfect job opportunities based on their skills and preferences."
    },
    {
      icon: <FaGraduationCap className="w-8 h-8 text-green-600" />,
      title: "Resume Builder",
      description: "Create professional resumes with our AI-assisted resume builder that suggests improvements and optimizations."
    },
    {
      icon: <FaRocket className="w-8 h-8 text-purple-600" />,
      title: "Career Growth",
      description: "Access mock interviews, skill assessments, and personalized career advice to accelerate your professional growth."
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-orange-600" />,
      title: "Direct Connect",
      description: "Connect directly with recruiters and hiring managers from top companies across various industries."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Students" },
    { number: "2,500+", label: "Partner Companies" },
    { number: "15,000+", label: "Jobs Posted" },
    { number: "8,500+", label: "Successful Placements" }
  ];

  const team = [
    {
      name: "Sonam Gupta",
      role: "Full Stack Developer",
      image: "/images/Sonam.jpg",
      description: "Lead developer passionate about creating seamless user experiences."
    },
    {
      name: "AI Assistant",
      role: "Career Advisor",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face",
      description: "AI-powered career guidance system for personalized job recommendations."
    },
    {
      name: "Aswani A.J",
      role: "Support Team",
      image: "/images/Aswani.jpg",
      description: "Dedicated support team ensuring smooth platform experience for all users."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-black bg-white bg-opacity-90 p-4 rounded-lg drop-shadow-lg">About HireHub</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-black font-medium bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            Connecting talented students with amazing career opportunities through AI-powered job matching,
            comprehensive career tools, and direct recruiter connections.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At HireHub, we believe every student deserves access to their dream job. Our platform leverages 
            cutting-edge AI technology to eliminate the barriers between talented students and forward-thinking 
            companies, creating a seamless hiring ecosystem that benefits everyone.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose HireHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Built with Modern Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">MERN Stack + AI</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <FaAward className="text-green-500" />
                  <span><strong>MongoDB:</strong> Flexible, scalable database for user and job data</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaAward className="text-green-500" />
                  <span><strong>Express.js:</strong> Fast, minimalist web framework for Node.js</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaAward className="text-green-500" />
                  <span><strong>React:</strong> Dynamic, responsive user interface</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaAward className="text-green-500" />
                  <span><strong>Node.js:</strong> Server-side JavaScript runtime</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaAward className="text-green-500" />
                  <span><strong>AI Integration:</strong> Smart job matching and career guidance</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded">Real-time Job Matching</div>
                  <div className="p-3 bg-green-50 rounded">AI Resume Builder</div>
                  <div className="p-3 bg-purple-50 rounded">Mock Interviews</div>
                  <div className="p-3 bg-orange-50 rounded">Skill Assessments</div>
                  <div className="p-3 bg-red-50 rounded">Career Guidance</div>
                  <div className="p-3 bg-yellow-50 rounded">Direct Messaging</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions about HireHub? Want to partner with us? We'd love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p>contact@hirehub.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p>123 Innovation Drive<br />Tech City, TC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

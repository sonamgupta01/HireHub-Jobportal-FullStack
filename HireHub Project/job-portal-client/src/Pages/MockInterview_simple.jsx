import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MockInterview = () => {
  const { user, isStudent } = useAuth();
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('beginner');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const questions = {
    technical: {
      beginner: [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain what a RESTful API is and its principles.",
        "What is the difference between == and === in JavaScript?",
        "What is HTML and how does it work?",
        "Explain the box model in CSS."
      ],
      intermediate: [
        "Explain the concept of closures in JavaScript with an example.",
        "What are the differences between SQL and NoSQL databases?",
        "Explain the concept of virtual DOM in React.",
        "What is the difference between synchronous and asynchronous programming?",
        "Explain the concept of inheritance in object-oriented programming."
      ]
    },
    behavioral: {
      beginner: [
        "Tell me about yourself.",
        "Why do you want to work here?",
        "What are your strengths and weaknesses?",
        "Where do you see yourself in 5 years?",
        "Why are you leaving your current job?"
      ],
      intermediate: [
        "Describe a challenging project you worked on.",
        "How do you handle criticism and feedback?",
        "Tell me about a time you failed and how you handled it.",
        "Describe a time when you had to work with a difficult team member.",
        "How do you prioritize your work when you have multiple deadlines?"
      ]
    },
    hr: {
      beginner: [
        "What salary range are you expecting?",
        "Do you have any questions for us?",
        "When can you start?",
        "Are you willing to relocate?",
        "What motivates you?"
      ],
      intermediate: [
        "How do you handle work-life balance?",
        "Describe your ideal work environment.",
        "What are your career goals?",
        "How do you stay updated with industry trends?",
        "What would you do if you disagreed with your manager?"
      ]
    }
  };

  if (!user || !isStudent()) {
    return <Navigate to="/login" replace />;
  }

  const currentQuestions = questions[interviewType][difficulty] || [];

  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
  };

  const nextQuestion = () => {
    setResponses([...responses, currentResponse]);
    setCurrentResponse('');
    
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    alert(`Interview completed! You answered ${responses.length + 1} questions.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤 Mock Interview</h1>
          <p className="text-lg text-gray-600">Practice your interview skills</p>
        </div>

        {!isInterviewActive ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interview Setup</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="technical">💻 Technical Interview</option>
                  <option value="behavioral">🧠 Behavioral Interview</option>
                  <option value="hr">👥 HR Interview</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">🚀 Intermediate</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
              <h3 className="font-bold text-blue-800 mb-4">What to expect:</h3>
              <ul className="text-blue-700 space-y-2">
                <li>✅ {currentQuestions.length} carefully selected questions</li>
                <li>✅ Practice answering in a realistic interview setting</li>
                <li>✅ Build confidence for real interviews</li>
                <li>✅ Improve your communication skills</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all text-lg font-bold shadow-lg"
            >
              🎯 Start Interview ({currentQuestions.length} questions)
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Question {currentQuestion + 1} of {currentQuestions.length}
              </h2>
              <button
                onClick={endInterview}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Interview
              </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <h3 className="font-bold text-blue-800 mb-3">Question:</h3>
              <p className="text-blue-700 text-lg">{currentQuestions[currentQuestion]}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Your Answer:</label>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Type your response here..."
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
              >
                {currentQuestion === currentQuestions.length - 1 ? 'Finish Interview' : 'Next Question →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;

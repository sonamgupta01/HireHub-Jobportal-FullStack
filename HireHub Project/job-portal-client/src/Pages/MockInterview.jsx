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
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

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

  // AI Feedback System
  const generateAIFeedback = (response, questionType, question) => {
    const responseLength = response.trim().length;
    const words = response.trim().split(/\s+/).length;

    let score = 0;
    let feedbackText = '';
    let suggestions = [];

    // Basic response analysis
    if (responseLength === 0) {
      score = 0;
      feedbackText = "No response provided. It's important to answer every question, even if briefly.";
      suggestions = [
        "Always provide some response, even if you're unsure",
        "Take a moment to think before answering",
        "Ask for clarification if needed"
      ];
    } else if (words < 10) {
      score = 2;
      feedbackText = "Very brief response. Try to provide more detailed answers.";
      suggestions = [
        "Expand on your answer with specific examples",
        "Use the STAR method (Situation, Task, Action, Result)",
        "Aim for 30-60 seconds of speaking time"
      ];
    } else if (words < 30) {
      score = 5;
      feedbackText = "Good start! Your response shows effort but could be more comprehensive.";
      suggestions = [
        "Add specific examples to support your points",
        "Include measurable results when possible",
        "Connect your answer to the role requirements"
      ];
    } else if (words < 100) {
      score = 7;
      feedbackText = "Well-structured response with good detail level.";
      suggestions = [
        "Great balance of detail and conciseness",
        "Consider adding one more specific example",
        "Strong communication skills demonstrated"
      ];
    } else {
      score = 8;
      feedbackText = "Comprehensive and detailed response. Excellent communication!";
      suggestions = [
        "Outstanding level of detail",
        "Shows strong preparation and thought process",
        "Professional communication style"
      ];
    }

    // Question-specific feedback
    if (questionType === 'technical') {
      if (response.toLowerCase().includes('example') || response.toLowerCase().includes('for instance')) {
        score += 1;
        suggestions.push("Great use of examples to explain technical concepts");
      }
      if (response.toLowerCase().includes('experience') || response.toLowerCase().includes('project')) {
        score += 1;
        suggestions.push("Excellent connection to practical experience");
      }
    } else if (questionType === 'behavioral') {
      if (response.toLowerCase().includes('situation') || response.toLowerCase().includes('challenge')) {
        score += 1;
        suggestions.push("Good use of specific situations");
      }
      if (response.toLowerCase().includes('result') || response.toLowerCase().includes('outcome')) {
        score += 1;
        suggestions.push("Excellent focus on results and outcomes");
      }
    } else if (questionType === 'hr') {
      if (response.toLowerCase().includes('company') || response.toLowerCase().includes('role')) {
        score += 1;
        suggestions.push("Shows good research about the company/role");
      }
    }

    // Cap score at 10
    score = Math.min(score, 10);

    return {
      score,
      feedback: feedbackText,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      question,
      response: response.substring(0, 100) + (response.length > 100 ? '...' : '')
    };
  };

  const startInterview = () => {
    setIsInterviewActive(true);
    setCurrentQuestion(0);
    setResponses([]);
    setCurrentResponse('');
  };

  const nextQuestion = () => {
    // Generate AI feedback for current response
    const currentQuestionText = currentQuestions[currentQuestion];
    const feedbackData = generateAIFeedback(currentResponse, interviewType, currentQuestionText);

    setResponses([...responses, currentResponse]);
    setFeedback([...feedback, feedbackData]);
    setCurrentResponse('');

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    // Generate final feedback for last question
    const currentQuestionText = currentQuestions[currentQuestion];
    const finalFeedbackData = generateAIFeedback(currentResponse, interviewType, currentQuestionText);
    const allFeedback = [...feedback, finalFeedbackData];

    // Calculate overall score
    const totalScore = allFeedback.reduce((sum, item) => sum + item.score, 0);
    const avgScore = Math.round((totalScore / allFeedback.length) * 10) / 10;

    setFeedback(allFeedback);
    setOverallScore(avgScore);
    setIsInterviewActive(false);
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤 Mock Interview</h1>
          <p className="text-lg text-gray-600">Practice your interview skills</p>
        </div>

        {showFeedback ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 Interview Complete!</h2>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-2">Overall Score</h3>
                <div className="text-4xl font-bold">{overallScore}/10</div>
                <p className="text-blue-100 mt-2">
                  {overallScore >= 8 ? "Excellent Performance! 🌟" :
                   overallScore >= 6 ? "Good Job! Keep Practicing 👍" :
                   overallScore >= 4 ? "Room for Improvement 📈" :
                   "Keep Practicing! You'll Get Better 💪"}
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800">📝 Detailed Feedback</h3>
              {feedback.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-gray-800">Question {index + 1}</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.score >= 8 ? 'bg-green-100 text-green-800' :
                      item.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      item.score >= 4 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.score}/10
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 italic">"{item.question}"</p>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700 font-medium mb-2">AI Feedback:</p>
                    <p className="text-gray-600">{item.feedback}</p>
                  </div>

                  {item.suggestions.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-2">💡 Suggestions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {item.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback([]);
                  setResponses([]);
                  setOverallScore(0);
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
              >
                🔄 Start New Interview
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all font-semibold"
              >
                🖨️ Print Feedback
              </button>
            </div>
          </div>
        ) : !isInterviewActive ? (
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

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaClock, FaCheck, FaTimes, FaLightbulb, FaTrophy } from 'react-icons/fa';

const SkillsQuiz = () => {
  const { user, isStudent } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const skillCategories = {
    javascript: {
      name: 'JavaScript',
      icon: '🟨',
      timeLimit: 900, // 15 minutes
      questions: [
        {
          id: 1,
          question: "What is the output of the following code?\n\nconsole.log(typeof null);",
          options: [
            "null",
            "undefined", 
            "object",
            "boolean"
          ],
          correct: 2,
          explanation: "In JavaScript, typeof null returns 'object'. This is a well-known quirk in JavaScript and is considered a bug in the language, but it's maintained for backward compatibility.",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Which method is used to add an element to the end of an array?",
          options: [
            "append()",
            "push()",
            "add()",
            "insert()"
          ],
          correct: 1,
          explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "What is a closure in JavaScript?",
          options: [
            "A function that has access to variables in its outer scope",
            "A way to close browser windows",
            "A method to end JavaScript execution",
            "A type of loop structure"
          ],
          correct: 0,
          explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This is a fundamental concept in JavaScript.",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "What does the '===' operator do in JavaScript?",
          options: [
            "Assigns a value",
            "Compares values with type coercion",
            "Compares values and types strictly",
            "Creates a new variable"
          ],
          correct: 2,
          explanation: "The '===' operator (strict equality) compares both value and type without performing any type coercion, unlike the '==' operator.",
          difficulty: "easy"
        },
        {
          id: 5,
          question: "Which of the following is the correct way to create a Promise in JavaScript?",
          options: [
            "new Promise((resolve, reject) => { /* code */ })",
            "Promise.create((resolve, reject) => { /* code */ })",
            "new Promise.async((resolve, reject) => { /* code */ })",
            "Promise((resolve, reject) => { /* code */ })"
          ],
          correct: 0,
          explanation: "Promises are created using the Promise constructor with a function that receives resolve and reject parameters.",
          difficulty: "medium"
        }
      ]
    },
    react: {
      name: 'React',
      icon: '⚛️',
      timeLimit: 720, // 12 minutes
      questions: [
        {
          id: 1,
          question: "What is JSX in React?",
          options: [
            "A JavaScript library",
            "A syntax extension for JavaScript",
            "A CSS framework",
            "A database query language"
          ],
          correct: 1,
          explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets compiled to React.createElement() calls.",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Which hook is used to manage state in functional components?",
          options: [
            "useEffect",
            "useState",
            "useContext",
            "useReducer"
          ],
          correct: 1,
          explanation: "useState is the primary hook for managing state in functional components. It returns an array with the current state value and a setter function.",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "What is the purpose of useEffect hook?",
          options: [
            "To manage component state",
            "To handle side effects in functional components",
            "To create context",
            "To optimize performance"
          ],
          correct: 1,
          explanation: "useEffect is used to handle side effects in functional components, such as API calls, timers, or DOM manipulations. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "What is the virtual DOM in React?",
          options: [
            "A real DOM element",
            "A JavaScript representation of the actual DOM",
            "A CSS styling method",
            "A database structure"
          ],
          correct: 1,
          explanation: "The virtual DOM is a JavaScript representation of the actual DOM. React uses it to optimize rendering by comparing the virtual DOM with the real DOM and updating only what has changed.",
          difficulty: "medium"
        }
      ]
    },
    nodejs: {
      name: 'Node.js',
      icon: '🟢',
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question: "What is Node.js?",
          options: [
            "A JavaScript framework",
            "A JavaScript runtime built on Chrome's V8 engine",
            "A database management system",
            "A CSS preprocessing tool"
          ],
          correct: 1,
          explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server side.",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Which module is used to create an HTTP server in Node.js?",
          options: [
            "fs",
            "path",
            "http",
            "url"
          ],
          correct: 2,
          explanation: "The 'http' module is used to create HTTP servers and clients in Node.js.",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "What is npm?",
          options: [
            "Node Package Manager",
            "New Programming Method",
            "Network Protocol Manager",
            "Node Performance Monitor"
          ],
          correct: 0,
          explanation: "npm stands for Node Package Manager. It's the default package manager for Node.js and is used to install, share, and manage dependencies.",
          difficulty: "easy"
        }
      ]
    },
    python: {
      name: 'Python',
      icon: '🐍',
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question: "What is the output of: print(type([1, 2, 3]))?",
          options: [
            "<class 'tuple'>",
            "<class 'list'>",
            "<class 'array'>",
            "<class 'set'>"
          ],
          correct: 1,
          explanation: "[1, 2, 3] creates a list in Python, so type() returns <class 'list'>.",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "Which of the following is used to define a function in Python?",
          options: [
            "function",
            "def",
            "func",
            "define"
          ],
          correct: 1,
          explanation: "The 'def' keyword is used to define functions in Python.",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "What is a list comprehension in Python?",
          options: [
            "A way to compress lists",
            "A concise way to create lists",
            "A method to sort lists",
            "A type of loop"
          ],
          correct: 1,
          explanation: "List comprehension is a concise way to create lists in Python using a single line of code with optional conditions.",
          difficulty: "medium"
        }
      ]
    }
  };

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizStarted) {
      completeQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  if (!user || !isStudent()) {
    return <Navigate to="/login" replace />;
  }

  const currentQuiz = skillCategories[selectedSkill];
  const currentQuestionData = currentQuiz?.questions[currentQuestion];

  const startQuiz = (skill) => {
    setSelectedSkill(skill);
    setQuizStarted(true);
    setTimeLeft(skillCategories[skill].timeLimit);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setResults(null);
  };

  const selectAnswer = (answerIndex) => {
    setAnswers({
      ...answers,
      [currentQuestionData.id]: answerIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    calculateResults();
  };

  const calculateResults = () => {
    const questions = currentQuiz.questions;
    let correct = 0;
    let totalQuestions = questions.length;
    
    const questionResults = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct;
      if (isCorrect) correct++;
      
      return {
        question: question.question,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
        correctAnswer: question.options[question.correct],
        isCorrect,
        explanation: question.explanation,
        difficulty: question.difficulty
      };
    });

    const percentage = Math.round((correct / totalQuestions) * 100);
    let level = 'Beginner';
    let recommendations = [];

    if (percentage >= 90) {
      level = 'Expert';
      recommendations = [
        'Consider mentoring others in this skill',
        'Look for advanced projects to challenge yourself',
        'Share your knowledge through blogs or tutorials'
      ];
    } else if (percentage >= 75) {
      level = 'Advanced';
      recommendations = [
        'Focus on advanced concepts and best practices',
        'Contribute to open source projects',
        'Consider taking on leadership roles in projects'
      ];
    } else if (percentage >= 60) {
      level = 'Intermediate';
      recommendations = [
        'Practice with more complex projects',
        'Study advanced topics and patterns',
        'Join developer communities and forums'
      ];
    } else {
      level = 'Beginner';
      recommendations = [
        'Start with basics and fundamental concepts',
        'Practice with simple projects',
        'Take online courses or tutorials',
        'Read documentation and beginner-friendly resources'
      ];
    }

    setResults({
      score: correct,
      total: totalQuestions,
      percentage,
      level,
      recommendations,
      questionResults,
      timeSpent: skillCategories[selectedSkill].timeLimit - timeLeft
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setSelectedSkill('');
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setShowExplanation(false);
  };

  // Skill Selection Screen
  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Skills Assessment Quiz</h1>
          <p className="text-gray-600">Test your knowledge and get personalized learning recommendations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(skillCategories).map(([key, skill]) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => startQuiz(key)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{skill.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {skill.questions.length} questions • {Math.floor(skill.timeLimit / 60)} minutes
                </p>
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-blue-700 text-sm">
                    Test your {skill.name} knowledge with hands-on questions
                  </p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700 text-sm">
            <div className="flex items-start gap-2">
              <FaClock className="mt-1 flex-shrink-0" />
              <div>
                <strong>Timed Assessment:</strong> Each quiz has a time limit to simulate real interview conditions
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaLightbulb className="mt-1 flex-shrink-0" />
              <div>
                <strong>Instant Feedback:</strong> Get detailed explanations for each question
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaTrophy className="mt-1 flex-shrink-0" />
              <div>
                <strong>Skill Level:</strong> Receive a skill level assessment and learning recommendations
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizCompleted && results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{results.percentage}%</div>
                <div className="text-blue-800">Overall Score</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{results.score}/{results.total}</div>
                <div className="text-green-800">Correct Answers</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{results.level}</div>
                <div className="text-purple-800">Skill Level</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <FaLightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h3>
            <div className="space-y-4">
              {results.questionResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {result.isCorrect ? (
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{result.question}</p>
                      <div className="text-sm text-gray-600">
                        <p><strong>Your answer:</strong> {result.userAnswer}</p>
                        <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      result.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.difficulty}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-4"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {currentQuiz.icon} {currentQuiz.name} Quiz
            </h2>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-600">
              <FaClock />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={completeQuiz}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              End Quiz
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <pre className="font-sans text-gray-800 whitespace-pre-wrap">{currentQuestionData.question}</pre>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestionData.id] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestionData.id] === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionData.id] === index && <FaCheck className="text-xs" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <FaLightbulb className="text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-yellow-800">Explanation:</strong>
                <p className="text-yellow-700 mt-1">{currentQuestionData.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
              disabled={answers[currentQuestionData.id] === undefined}
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {currentQuestion === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsQuiz;

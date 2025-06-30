import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import MyJobs from '../Pages/MyJobs';
import CreateJob from '../Pages/CreateJob';
import Home from '../Pages/Home';

import JobDetails from '../Pages/JobDetails';
import About from '../Pages/About';
import Dashboard from '../Pages/Dashboard';
import AppliedJobs from '../Pages/AppliedJobs';
import Applications from '../Pages/Applications';
import SavedJobs from '../Pages/SavedJobs';
import ResumeBuilder from '../Pages/ResumeBuilder';
import MockInterview from '../Pages/MockInterview';
import SkillsQuiz from '../Pages/SkillsQuiz';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/skills-quiz" element={<SkillsQuiz />} />
          <Route path="/applications" element={<Applications />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

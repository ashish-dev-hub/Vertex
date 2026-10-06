 import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Common Pages */}
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* Student Pages */}
        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Recruiter Pages */}
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/post-job"
          element={<PostJob />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
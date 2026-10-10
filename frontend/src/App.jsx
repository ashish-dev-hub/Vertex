import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import RecruiterProfile from "./pages/RecruiterProfile";

import MLIntelligenceHub from "./pages/MLIntelligenceHub";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Common Pages */}
        <Route path="/" element={<Landing />} />

        {/* Vertex ML Intelligence Suite (Dropdowns + All 4 ML APIs) */}
        <Route path="/ml" element={<MLIntelligenceHub />} />
        <Route path="/ml/student" element={<MLIntelligenceHub role="student" />} />
        <Route path="/ml/recruiter" element={<MLIntelligenceHub role="recruiter" />} />
        <Route path="/vertex-ml" element={<MLIntelligenceHub />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        {/* Student Pages */}
        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Recruiter profile completion */}
        <Route
          path="/recruiter/profile"
          element={<RecruiterProfile />} 
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
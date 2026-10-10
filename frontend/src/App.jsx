import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import RecruiterProfile from "./pages/RecruiterProfile";

import MLIntelligenceHub from "./pages/MLIntelligenceHub";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Common Pages */}
        <Route path="/" element={<Landing />} />

        {/* ML Hub – Student only (Candidate Fit + Salary Prediction) */}
        <Route
          path="/ml/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MLIntelligenceHub role="student" />
            </ProtectedRoute>
          }
        />

        {/* ML Hub – Recruiter only (Job Recommendation + Final Match) */}
        <Route
          path="/ml/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <MLIntelligenceHub role="recruiter" />
            </ProtectedRoute>
          }
        />

        {/* Redirect /ml and /vertex-ml to login (no direct access without role) */}
        <Route path="/ml" element={<Navigate to="/login" replace />} />
        <Route path="/vertex-ml" element={<Navigate to="/login" replace />} />

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
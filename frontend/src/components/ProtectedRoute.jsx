import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute – Guards routes behind authentication and optional role checks.
 *
 * Props:
 *  - children       : The component to render if authorized.
 *  - allowedRoles   : (optional) Array of roles that can access this route,
 *                     e.g. ["student"] or ["recruiter"].
 *                     If omitted, any logged-in user can access.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to their own dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

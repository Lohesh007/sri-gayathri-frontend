import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, token, authLoaded } = useContext(AuthContext);

  // Wait until AuthContext finishes reading from localStorage
  if (!authLoaded) {
    return <div className="loading-spinner">Loading...</div>; // or null
  }

  // If not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If admin privileges are required but user is not admin
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />; // redirect to home or unauthorized page
  }

  // If client privileges are required but user is admin
  if (userOnly && user?.isAdmin) {
    return <Navigate to="/admin" replace />; // redirect admin to dashboard
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to check authentication
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // If not authenticated, redirect to home or a login page
    return <Navigate to="/" replace />;
  }
  // If authenticated, render the child component (Editor in this case)
  return children;
};

export default ProtectedRoute;

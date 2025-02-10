import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;
      switch (role) {
        case 'applicant':
          return <Navigate to="/ApplicantHome" replace />;
        case 'employer':
          return <Navigate to="/empDash" replace />;
        case 'admin':
          return <Navigate to="/useradmin" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return children;
    }
  }

  return children;
};

export default PublicRoute;
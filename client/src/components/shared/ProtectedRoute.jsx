import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from './loader/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, initialized } = useSelector(state => state.auth);

  if (!initialized) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the user's actual role dashboard if they hit a wrong route
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;

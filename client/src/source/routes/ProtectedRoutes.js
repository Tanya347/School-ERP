// src/routes/ProtectedRoutes.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/home" />;
};

export const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user.isAdmin ? children : <Navigate to="/home" />;
};

export const RequireStudent = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user.isStudent ? children : <Navigate to="/home" />;
};

export const RequireFaculty = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user.isFaculty ? children : <Navigate to="/home" />;
};

export const LoggedIn = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" />;
    if (user.isFaculty) return <Navigate to="/faculty" />;
    if (user.isStudent) return <Navigate to="/student" />;
    else return <Navigate to="/" />;
  } else return children;
};

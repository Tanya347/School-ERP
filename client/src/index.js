import 'react-toastify/dist/ReactToastify.css'; 

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { DarkModeContextProvider } from "./config/context/darkModeContext";
import { AuthProvider } from './config/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
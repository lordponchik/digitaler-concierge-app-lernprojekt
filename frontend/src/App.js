import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a56db',
    },
    secondary: {
      main: '#0e9f6e',
    },
  },
});

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
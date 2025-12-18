import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
//import Services from './pages/Services';
//import Info from './pages/Info';
//import Profile from './pages/Profile';
//import AdminLogin from './pages/Admin/AdminLogin';
//import AdminDashboard from './pages/Admin/AdminDashboard';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedAdmin = localStorage.getItem('isAdmin');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
        <Router>
          <div className="App">
            <Routes>
              {}
              <Route path="/login" element={<Login />} />
              {/*<Route path="/admin/login" element={<AdminLogin />} />*/ }
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              {/*<Route 
                path="/services" 
                element={isAuthenticated ? <Services /> : <Navigate to="/login" />} 
              />*/ }
              {/*<Route 
                path="/info" 
                element={isAuthenticated ? <Info /> : <Navigate to="/login" />} 
              />*/ }
              {/*<Route 
                path="/profile" 
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
              />*/ }
              
              {/*<Route 
                path="/admin" 
                element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
              />*/ }
              
              
              {}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
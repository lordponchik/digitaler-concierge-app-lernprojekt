import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Info from './pages/Info';
import Services from './pages/Services';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';


const theme = createTheme({
  palette: {
    primary: { main: '#1a56db' },
    secondary: { main: '#0e9f6e' },
  },
});

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div>Lade...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Lade Hotel Concierge...</div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/info" element={
            <ProtectedRoute>
              <Info />
            </ProtectedRoute>
          } />
          <Route 
  path="/services" 
  element={
    <ProtectedRoute>
      <Services />
    </ProtectedRoute>
  } 
/>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
          path="/admin/dashboard" 
          element={
          <ProtectedRoute requireAdmin>
          <AdminDashboard />
          </ProtectedRoute>
           } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
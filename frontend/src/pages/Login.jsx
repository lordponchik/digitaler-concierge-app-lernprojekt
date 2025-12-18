import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authenticateGuest } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    roomNumber: '',
    pinCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.roomNumber === '102' && formData.pinCode === '4297') {
        const guestData = {
          guestId: 'guest_abc123',
          name: 'Thomas Schmidt',
          roomNumber: '102',
        };
        
        const roomData = {
          roomId: 'room_102',
          roomNumber: '102',
        };
        
        login(guestData, roomData);
        navigate('/dashboard');
      } else {
        setError('Falsche Zimmernummer oder PIN');
      }
      
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
             Hotel Concierge
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="roomNumber"
              label="Zimmernummer"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              autoComplete="off"
              autoFocus
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="pinCode"
              label="PIN-Code"
              type="password"
              id="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              autoComplete="off"
              inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ANMELDEN'}
            </Button>
          </Box>
        </Paper>
        
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/login')}
        >
          Mitarbeiter-Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
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
import { loginGuest } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginGuest: loginGuestContext } = useAuth();

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
      const result = await loginGuest(formData.roomNumber, formData.pinCode);
      
      if (result.success) {
        loginGuestContext(result.user);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Hotel STAY.GOOD
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Digitaler Concierge Service
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Zimmernummer"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              inputProps={{ inputMode: 'numeric' }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="PIN-Code"
              name="pinCode"
              type="password"
              value={formData.pinCode}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 4, inputMode: 'numeric' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ANMELDEN'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
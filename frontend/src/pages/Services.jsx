import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Send,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRequests, setUserRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [formData, setFormData] = useState({
    type: 'TOWELS',
    description: '',
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (isAuthenticated && user?.roomNumber) {
      loadUserRequests();
    }
  }, [isAuthenticated, user]);

  const loadUserRequests = async () => {
    setLoadingRequests(true);
    try {
      const requestsRef = collection(db, 'requests');
      const q = query(
        requestsRef,
        where('roomNumber', '==', user.roomNumber),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      setUserRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.description.trim()) {
      setError('Bitte geben Sie eine Beschreibung ein');
      setLoading(false);
      return;
    }

    try {
      const requestsRef = collection(db, 'requests');
      const newRequest = {
        roomNumber: user.roomNumber,
        guestName: user.guestName || `Gast ${user.roomNumber}`,
        type: formData.type,
        description: formData.description.trim(),
        status: 'PENDING',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        guestId: user.guestId || null,
      };

      await addDoc(requestsRef, newRequest);
      
      setFormData({
        type: 'TOWELS',
        description: '',
      });
      
      setSuccess('Ihre Anfrage wurde erfolgreich gesendet!');
      
      await loadUserRequests();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error creating request:', error);
      setError('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };


  const getTypeLabel = (type) => {
    switch (type) {
      case 'TOWELS': return 'Handtücher & Bettwäsche';
      case 'CLEANING': return 'Zimmerreinigung';
      case 'TAXI': return 'Taxi / Transfer';
      case 'WAKEUP': return 'Weckdienst';
      default: return 'Sonstiges';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Offen';
      case 'IN_PROGRESS': return 'In Bearbeitung';
      case 'COMPLETED': return 'Erledigt';
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Zurück zum Dashboard
        </Button>
        <Typography variant="h4" gutterBottom>
          Service-Anfrage
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Zimmer {user?.roomNumber || '---'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Neue Service-Anfrage
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Art der Anfrage</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  label="Art der Anfrage"
                  onChange={handleChange}
                >
                  <MenuItem value="TOWELS">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Handtücher & Bettwäsche
                    </Box>
                  </MenuItem>
                  <MenuItem value="CLEANING">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Zimmerreinigung
                    </Box>
                  </MenuItem>
                  <MenuItem value="TAXI">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Taxi / Transfer
                    </Box>
                  </MenuItem>
                  <MenuItem value="WAKEUP">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Weckdienst
                    </Box>
                  </MenuItem>
                  <MenuItem value="OTHER">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Sonstiges
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                id="description"
                name="description"
                label="Beschreibung"
                placeholder="z.B. Bitte 2 zusätzliche Handtücher bringen oder Wecker auf 07:00 stellen"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />

              <Box sx={{ mt: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Tipps:</strong><br />
                  • Seien Sie so konkret wie möglich<br />
                  • Geben Sie bei Taxi die gewünschte Uhrzeit an<br />
                  • Bei Weckdienst die genaue Weckzeit<br />
                  • Die Rezeption wird sich um Ihr Anliegen kümmern
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Send />}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'ANFRAGE SENDEN'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        bgcolor: 'white',
        borderTop: 1,
        borderColor: 'divider',
        p: 2,
        zIndex: 1000
      }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button 
              fullWidth 
              onClick={() => navigate('/info')}
            >
              Hotel Info
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Services;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Info,
  Person,
  Logout,
  Refresh,
  Bathtub,
  CleaningServices,
  DirectionsCar,
  Notifications,
  Assignment,
  CheckCircle,
  Pending,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { guestData, roomData, logout, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserRequests = async () => {
    if (!user?.roomNumber) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const requestsRef = collection(db, 'requests');
      const q = query(
        requestsRef,
        where('roomNumber', '==', user.roomNumber)
      );
      
      const querySnapshot = await getDocs(q);
      const requestsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requestsData.push({
          id: doc.id,
          type: data.type || 'OTHER',
          description: data.description || '',
          status: data.status || 'PENDING',
          createdAt: data.createdAt?.toDate() || new Date(),
          roomNumber: data.roomNumber,
        });
      });
      requestsData.sort((a, b) => b.createdAt - a.createdAt);
      
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      setError('Fehler beim Laden Ihrer Anfragen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [user?.roomNumber]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchUserRequests();
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'TOWELS': return 'Handtücher';
      case 'CLEANING': return 'Reinigung';
      case 'TAXI': return 'Taxi';
      case 'WAKEUP': return 'Weckdienst';
      default: return 'Sonstiges';
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'warning',
          icon: <Pending />,
          text: 'Offen',
          label: 'Wird bearbeitet'
        };
      case 'IN_PROGRESS':
        return {
          color: 'info',
          icon: <AccessTime />,
          text: 'In Bearbeitung',
          label: 'Wird bearbeitet'
        };
      case 'COMPLETED':
        return {
          color: 'success',
          icon: <CheckCircle />,
          text: 'Erledigt',
          label: 'Abgeschlossen'
        };
      default:
        return {
          color: 'default',
          icon: <Pending />,
          text: status,
          label: status
        };
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const requestDate = new Date(date);
    const isToday = requestDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Heute ${requestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return requestDate.toLocaleDateString() + ' ' + 
             requestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Willkommen, {guestData?.guestName || user?.guestName || 'Gast'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Zimmer {roomData?.roomNumber || user?.roomNumber || '---'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {requests.length > 0 
                ? `Sie haben ${requests.length} Service-Anfrage(n)` 
                : 'Noch keine Service-Anfragen'}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
            <IconButton onClick={handleLogout} color="error">
              <Logout />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Service Requests */}
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        Meine Service-Anfragen
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography color="text.secondary" gutterBottom>
                Noch keine Service-Anfragen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Erstellen Sie Ihre erste Anfrage für Handtücher, Reinigung oder Taxi.
              </Typography>
            </Box>
          ) : (
            <List>
              {requests.map((request) => {
                const statusInfo = getStatusInfo(request.status);
                
                return (
                  <ListItem 
                    key={request.id}
                    sx={{ 
                      borderLeft: 4,
                      borderColor: `${statusInfo.color}.main`,
                      mb: 1,
                      borderRadius: 1
                    }}
                    secondaryAction={
                      <Chip 
                        icon={statusInfo.icon}
                        label={statusInfo.text}
                        color={statusInfo.color}
                        size="small"
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {getTypeText(request.type)}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                            {request.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(request.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/services')}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Lade...
              </>
            ) : (
              'Neue Anfrage erstellen'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
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
              startIcon={<Info />}
              onClick={() => navigate('/info')}
            >
              Info
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
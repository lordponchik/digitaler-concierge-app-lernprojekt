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
  Chip,
  IconButton,
} from '@mui/material';
import {
  CleaningServices,
  DirectionsCar,
  Bathtub,
  Notifications,
  Info,
  Person,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { guestData, roomData, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests([
      { id: 1, type: 'Handtücher', status: 'in Bearbeitung', time: '10:30' },
      { id: 2, type: 'Zimmerreinigung', status: 'erledigt', time: '09:15' },
    ]);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    { icon: <Bathtub />, label: 'Handtücher', color: '#1a56db', route: '/services?type=towels' },
    { icon: <CleaningServices />, label: 'Reinigung', color: '#0e9f6e', route: '/services?type=cleaning' },
    { icon: <DirectionsCar />, label: 'Taxi', color: '#f05252', route: '/services?type=taxi' },
    { icon: <Notifications />, label: 'Wecker', color: '#8b5cf6', route: '/services?type=wakeup' },
  ];

  return (
    <Container maxWidth="md">
      {}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Willkommen, {guestData?.name || 'Gast'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Zimmer {roomData?.roomNumber || '---'}
            </Typography>
          </Box>
          <IconButton onClick={handleLogout} color="error">
            <Logout />
          </IconButton>
        </Box>
      </Box>

      {}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Schnellzugriff
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f9fafb' }
              }}
              onClick={() => navigate(action.route)}
            >
              <CardContent>
                <Box sx={{ color: action.color, fontSize: 40, mb: 1 }}>
                  {action.icon}
                </Box>
                <Typography variant="body2">{action.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Meine Anfragen
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {requests.length > 0 ? (
            <List>
              {requests.map((request) => (
                <ListItem 
                  key={request.id}
                  secondaryAction={
                    <Chip 
                      label={request.status}
                      color={request.status === 'erledigt' ? 'success' : 'primary'}
                      size="small"
                    />
                  }
                >
                  <ListItemText 
                    primary={request.type}
                    secondary={`${request.time}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" align="center">
              Keine aktiven Anfragen
            </Typography>
          )}
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/services')}
          >
            Neue Anfrage
          </Button>
        </CardContent>
      </Card>

      {}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        bgcolor: 'white',
        borderTop: 1,
        borderColor: 'divider',
        p: 2
      }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button 
              fullWidth 
              startIcon={<CleaningServices />}
              onClick={() => navigate('/services')}
            >
              Service
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button 
              fullWidth 
              startIcon={<Info />}
              onClick={() => navigate('/info')}
            >
              Info
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button 
              fullWidth 
              startIcon={<Person />}
              onClick={() => navigate('/profile')}
            >
              Profil
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
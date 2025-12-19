import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Info = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const hotelInfo = {
    wifi: { ssid: 'STAY.GOOD_GUEST', password: 'Welcome2026!' },
    times: {
      checkIn: 'ab 15:00 Uhr',
      checkOut: 'bis 11:00 Uhr',
      breakfast: '06:30 - 10:30',
      reception: '24/7'
    },
    contacts: {
      reception: '112',
      emergency: '110',
      taxi: '+49 69 230033'
    },
    services: [
      'Kostenloses WLAN',
      'Frühstücksbuffet (€25)',
      'Swimmingpool (08:00-20:00)',
      'Fitness-Studio (06:00-22:00)',
      'Hotel Bar (18:00-01:00)'
    ]
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          ℹ️ Hotel Informationen
        </Typography>

        <Box sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            🔐 WLAN-Zugang
          </Typography>
          <Typography variant="body2">
            <strong>Netzwerk:</strong> {hotelInfo.wifi.ssid}<br />
            <strong>Passwort:</strong> {hotelInfo.wifi.password}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🕒 Zeiten
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Check-in" 
                secondary={hotelInfo.times.checkIn}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Check-out" 
                secondary={hotelInfo.times.checkOut}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Frühstück" 
                secondary={hotelInfo.times.breakfast}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ✅ Services
          </Typography>
          <List dense>
            {hotelInfo.services.map((service, index) => (
              <ListItem key={index}>
                <ListItemText primary={`• ${service}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📞 Kontakte
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Rezeption" 
                secondary={hotelInfo.contacts.reception}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Taxi" 
                secondary={hotelInfo.contacts.taxi}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Notfall" 
                secondary={hotelInfo.contacts.emergency}
              />
            </ListItem>
          </List>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
          >
            Zurück
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Info;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Info,
  CleaningServices,
  Bathtub,
  DirectionsCar,
  Notifications,
  CheckCircle,
  Pending,
  AccessTime,
  Logout,
  Refresh,
  Assignment,
  Hotel,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, orderBy, query, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const requestsRef = collection(db, 'requests');
      const q = query(requestsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const requestsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requestsData.push({
          id: doc.id,
          roomNumber: data.roomNumber || 'Unbekannt',
          type: data.type || 'OTHER',
          description: data.description || '',
          status: data.status || 'PENDING',
          createdAt: data.createdAt?.toDate() || new Date(),
          guestName: data.guestName || `Gast ${data.roomNumber || ''}`,
          guestId: data.guestId,
        });
      });
      
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Fehler beim Laden der Anfragen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    fetchRequests();
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

const handleStatusChange = async (requestId, newStatus) => {
  try {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { 
          ...req, 
          status: newStatus,
          updatedAt: new Date() 
        } : req
      )
    );
    
    if (!requestId || typeof requestId !== 'string') {
      console.error('Invalid requestId:', requestId);
      return;
    }
    
    const requestRef = doc(db, 'requests', requestId);
    
    const { getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(requestRef);
    
    if (!docSnap.exists()) {
      console.error('Document does not exist:', requestId);
      return;
    }
    
    await updateDoc(requestRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    
  } catch (error) {
    console.error('ERROR DETAILS:', {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { 
          ...req, 
          status: req.status 
        } : req
      )
    );
    
  }
};

  const handleRefresh = () => {
    fetchRequests();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Pending color="warning" />;
      case 'IN_PROGRESS': return <AccessTime color="info" />;
      case 'COMPLETED': return <CheckCircle color="success" />;
      default: return <Pending />;
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TOWELS': return <Bathtub />;
      case 'CLEANING': return <CleaningServices />;
      case 'TAXI': return <DirectionsCar />;
      case 'WAKEUP': return <Notifications />;
      default: return <Assignment />;
    }
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

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const today = new Date().toDateString();
  const todayCount = requests.filter(r => 
    new Date(r.createdAt).toDateString() === today
  ).length;

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Lade Dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      {/* Header */}
      <Box sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Rezeption - Service Management
          </Typography>
        </Box>
        
        <Box>
          <IconButton onClick={handleRefresh} sx={{ mr: 2 }}>
            <Refresh />
          </IconButton>
          <IconButton onClick={handleLogout} color="error">
            <Logout />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Pending color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Offen</Typography>
              </Box>
              <Typography variant="h3">{pendingCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Anfragen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">In Bearbeitung</Typography>
              </Box>
              <Typography variant="h3">{inProgressCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Anfragen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Erledigt</Typography>
              </Box>
              <Typography variant="h3">{completedCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Anfragen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Hotel sx={{ mr: 1 }} />
                <Typography variant="h6">Heute</Typography>
              </Box>
              <Typography variant="h3">{todayCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Neue Anfragen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Service Requests List */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Aktuelle Service-Anfragen ({requests.length})
          </Typography>
          <Chip 
            label={`${pendingCount} offen`} 
            color="warning" 
            variant="outlined"
          />
        </Box>

        {requests.length === 0 ? (
          <Alert severity="info">
            Keine Service-Anfragen vorhanden.
          </Alert>
        ) : (
          <List>
            {requests.map((request) => (
              <React.Fragment key={request.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={getStatusText(request.status)}
                        size="small"
                        color={getStatusColor(request.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={getTypeText(request.type)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getTypeIcon(request.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        Zimmer {request.roomNumber} - {request.guestName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {request.description}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(request.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                
                {request.status !== 'COMPLETED' && (
                  <Box sx={{ pl: 9, pr: 2, pb: 2, display: 'flex', gap: 1 }}>
                    {request.status === 'PENDING' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusChange(request.id, 'IN_PROGRESS')}
                      >
                        In Bearbeitung nehmen
                      </Button>
                    )}
                    
                    {request.status === 'IN_PROGRESS' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                      >
                        Als erledigt markieren
                      </Button>
                    )}         
                    {request.status === 'PENDING' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                      >
                        Direkt erledigen
                      </Button>
                    )}
                  </Box>
                )}
                
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Bottom Info */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Info:</strong> Daten werden direkt aus Firebase Firestore geladen.<br />
          <strong>Status:</strong> PENDING → IN_PROGRESS → COMPLETED
        </Typography>
      </Alert>
    </Container>
  );
};

export default AdminDashboard;
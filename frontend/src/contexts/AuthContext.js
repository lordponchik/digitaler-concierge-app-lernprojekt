import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const getInitialAuthState = () => {
  try {
    const guestSession = localStorage.getItem('guestSession');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const guestData = JSON.parse(localStorage.getItem('guestData') || 'null');
    const roomData = JSON.parse(localStorage.getItem('roomData') || 'null');
    const adminData = JSON.parse(localStorage.getItem('adminData') || 'null');

    if (guestSession) {
      const sessionData = JSON.parse(guestSession);
      return {
        isAuthenticated: !!isAuthenticated,
        isAdmin: !!isAdmin,
        user: sessionData,
        guestData: sessionData, 
        roomData: { roomNumber: sessionData.roomNumber },
      };
    } else if (adminData && isAdmin) {
      return {
        isAuthenticated: !!isAuthenticated,
        isAdmin: !!isAdmin,
        user: adminData,
        guestData: null,
        roomData: null,
      };
    } else if (guestData && roomData) {
      return {
        isAuthenticated: !!isAuthenticated,
        isAdmin: !!isAdmin,
        user: guestData,
        guestData: guestData,
        roomData: roomData,
      };
    } else {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        guestData: null,
        roomData: null,
      };
    }
  } catch (e) {
    console.error('Error loading auth state:', e);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      guestData: null,
      roomData: null,
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => getInitialAuthState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndUpdateAuth = async () => {
      if (authState.isAuthenticated && authState.user?.guestId) {
        try {
        } catch (error) {
          console.error('Error updating auth data:', error);
        }
      }
      setLoading(false);
    };

    checkAndUpdateAuth();
  }, []);

  const loginGuest = (sessionData) => {
    const newState = {
      isAuthenticated: true,
      isAdmin: false,
      user: sessionData,
      guestData: sessionData, 
      roomData: { roomNumber: sessionData.roomNumber }, 
    };
    
    setAuthState(newState);
    
    localStorage.setItem('guestSession', JSON.stringify(sessionData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('guestData', JSON.stringify(sessionData)); // для совместимости
    localStorage.setItem('roomData', JSON.stringify({ roomNumber: sessionData.roomNumber })); // для совместимости
  };

  const login = (guestData, roomData) => {
    const sessionData = {
      ...guestData,
      roomNumber: roomData?.roomNumber || guestData?.roomNumber,
      role: 'guest'
    };
    
    loginGuest(sessionData);
  };

  const adminLogin = (adminData) => {
    const newState = {
      isAuthenticated: true,
      isAdmin: true,
      user: adminData,
      guestData: null,
      roomData: null,
    };
    
    setAuthState(newState);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.removeItem('guestSession');
    localStorage.removeItem('guestData');
    localStorage.removeItem('roomData');
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      guestData: null,
      roomData: null,
    });
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('guestSession');
    localStorage.removeItem('guestData');
    localStorage.removeItem('roomData');
    localStorage.removeItem('roomNumber');
    localStorage.removeItem('adminData');
  };

  const refreshUserData = async () => {
    if (!authState.user?.guestId) return;
    
    try {
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      loading,
      login, 
      loginGuest,
      adminLogin, 
      logout,
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
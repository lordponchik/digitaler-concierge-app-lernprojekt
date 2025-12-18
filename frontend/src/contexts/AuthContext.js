import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, value }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: value?.isAuthenticated || false,
    isAdmin: value?.isAdmin || false,
    guestData: null,
    roomData: null,
  });

  const login = (guestData, roomData) => {
    setAuthState({
      isAuthenticated: true,
      isAdmin: false,
      guestData,
      roomData,
    });
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('guestData', JSON.stringify(guestData));
    localStorage.setItem('roomData', JSON.stringify(roomData));
  };

  const adminLogin = () => {
    setAuthState({
      isAuthenticated: true,
      isAdmin: true,
      guestData: null,
      roomData: null,
    });
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', 'true');
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      guestData: null,
      roomData: null,
    });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('guestData');
    localStorage.removeItem('roomData');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, adminLogin, logout }}>
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
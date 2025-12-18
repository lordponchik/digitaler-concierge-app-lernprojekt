import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const authenticateGuest = async (roomNumber, pinCode) => {
  try {
    if (roomNumber === '102' && pinCode === '4297') {
      return {
        success: true,
        guestData: {
          guestId: 'guest_test_123',
          name: 'Test Gast',
          roomNumber: '102',
        },
        roomData: {
          roomId: 'room_102',
          roomNumber: '102',
        },
        error: null
      };
    }
    
    if (roomNumber === '103' && pinCode === '1234') {
      return {
        success: true,
        guestData: {
          guestId: 'guest_test_456',
          name: 'Max Mustermann',
          roomNumber: '103',
        },
        roomData: {
          roomId: 'room_103',
          roomNumber: '103',
        },
        error: null
      };
    }
    
    return {
      success: false,
      guestData: null,
      roomData: null,
      error: 'Falsche Zimmernummer oder PIN'
    };
    
    /*
    // 
    try {
      const roomsRef = collection(db, 'rooms');
      const q = query(
        roomsRef,
        where('roomNumber', '==', roomNumber),
        where('currentPassword', '==', pinCode),
        where('status', '==', 'OCCUPIED')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return {
          success: false,
          error: 'Falsche Zimmernummer oder PIN'
        };
      }
      
      const roomDoc = querySnapshot.docs[0];
      const roomData = roomDoc.data();
      const roomId = roomDoc.id;
      
      const guestsRef = collection(db, 'guests');
      const guestQuery = query(
        guestsRef,
        where('assignedRoom', '==', roomId),
        where('status', '==', 'CHECKED_IN')
      );
      
      const guestSnapshot = await getDocs(guestQuery);
      
      if (guestSnapshot.empty) {
        return {
          success: false,
          error: 'Kein Gast für dieses Zimmer gefunden'
        };
      }
      
      const guestDoc = guestSnapshot.docs[0];
      const guestData = guestDoc.data();
      const guestId = guestDoc.id;
      
      return {
        success: true,
        guestData: {
          guestId,
          name: `${guestData.firstName} ${guestData.lastName}`,
          roomNumber: roomData.roomNumber,
          checkIn: guestData.checkIn,
          checkOut: guestData.checkOut
        },
        roomData: {
          roomId,
          roomNumber: roomData.roomNumber
        },
        error: null
      };
      
    } catch (firebaseError) {
      console.error('Firebase error:', firebaseError);
      return {
        success: false,
        error: 'Server-Fehler. Bitte versuchen Sie es später erneut.'
      };
    }
    */
    
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Ein unerwarteter Fehler ist aufgetreten'
    };
  }
};


export const authenticateAdmin = async (adminPin) => {
  const ADMIN_PINS = ['ADMIN123', 'RECEPTION2024', '123456'];
  
  if (ADMIN_PINS.includes(adminPin)) {
    return {
      success: true,
      role: 'RECEPTION',
      error: null
    };
  }
  
  return {
    success: false,
    role: null,
    error: 'Ungültiger Admin-PIN'
  };
  
  /*
  // 
  try {
    const adminsRef = collection(db, 'admins');
    const q = query(
      adminsRef,
      where('pinCode', '==', adminPin),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'Ungültiger Admin-PIN'
      };
    }
    
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();
    
    return {
      success: true,
      role: adminData.role,
      adminId: adminDoc.id,
      error: null
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Admin-Authentifizierung fehlgeschlagen'
    };
  }
  */
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('guestData');
  localStorage.removeItem('roomData');
  localStorage.removeItem('adminData');
  
  return {
    success: true,
    message: 'Erfolgreich abgemeldet'
  };
};
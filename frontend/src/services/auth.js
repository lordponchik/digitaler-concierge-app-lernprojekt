import { db } from '../firebaseConfig';
import { 
  doc,
  getDoc,
} from 'firebase/firestore';

export const loginGuest = async (roomNumber, pinCode) => {
  try {
    const roomRef = doc(db, 'rooms', roomNumber);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return { success: false, error: 'Zimmer nicht gefunden' };
    }
    
    const roomData = roomSnap.data();
    
    if (roomData.currentPassword !== pinCode) {
      return { success: false, error: 'Falscher PIN-Code' };
    }
    
    if (roomData.status !== 'OCCUPIED') {
      return { success: false, error: 'Zimmer ist nicht belegt' };
    }
    
    if (!roomData.currentGuestId) {
      return { 
        success: false, 
        error: 'Kein Gast für dieses Zimmer zugewiesen' 
      };
    }
    
    const guestId = roomData.currentGuestId;
    
    const guestRef = doc(db, 'guests', guestId);
    const guestSnap = await getDoc(guestRef);
    
    if (!guestSnap.exists()) {
      return { 
        success: false, 
        error: 'Gast nicht gefunden' 
      };
    }
    
    const guestData = guestSnap.data();

    if (guestData.roomNumber !== roomNumber) {
      console.warn('Room mismatch:', guestData.roomNumber, roomNumber);
    }
    
    if (guestData.status !== 'CHECKED_IN') {
      return { 
        success: false, 
        error: 'Gast nicht eingecheckt' 
      };
    }
    
    const sessionData = {
      guestId: guestId,
      roomNumber: roomNumber,
      guestName: `${guestData.firstName} ${guestData.lastName}`,
      checkIn: guestData.checkIn,
      checkOut: guestData.checkOut,
      role: 'guest'
    };
    
    localStorage.setItem('guestSession', JSON.stringify(sessionData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('roomNumber', roomNumber);
    
    return { 
      success: true, 
      user: sessionData 
    };
    
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'permission-denied') {
      if (error.message.includes('rooms')) {
        return { 
          success: false, 
          error: 'Kein Zugriff auf Zimmerdaten' 
        };
      } else if (error.message.includes('guests')) {
        return { 
          success: false, 
          error: 'Kein Zugriff auf Gastdaten' 
        };
      }
      return { 
        success: false, 
        error: 'Zugriff verweigert' 
      };
    }
    
    return {
      success: false,
      error: error.message || 'Login fehlgeschlagen'
    };
  }
};
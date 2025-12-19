import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCktH7fznVMyThLygeH0gZjFygy2W-xOrk",
  authDomain: "digitaler-concierge-app.firebaseapp.com",
  projectId: "digitaler-concierge-app",
  storageBucket: "digitaler-concierge-app.firebasestorage.app",
  messagingSenderId: "722968914526",
  appId: "1:722968914526:web:05e361892933b4fc4d22cf",
  measurementId: "G-BYZJYLCR6T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInAnonymously };
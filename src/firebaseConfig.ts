import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD2opye5X4N5avt0VeEycjbBJxH5yH1iIo',
  authDomain: 'pampershop-19f2b.firebaseapp.com',
  projectId: 'pampershop-19f2b',
  storageBucket: 'pampershop-19f2b.firebasestorage.app',
  messagingSenderId: '300017926653',
  appId: '1:300017926653:web:f44a9a1d1d7d4b10145994',
  measurementId: 'G-493XP364TR',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(app);

export { firestore };

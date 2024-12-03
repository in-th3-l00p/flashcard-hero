import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiGQczt6QRxoJyeT4tdkJ8v9_Uq_1-ltE",
  authDomain: "flashcardhero-9b977.firebaseapp.com",
  projectId: "flashcardhero-9b977",
  storageBucket: "flashcardhero-9b977.firebasestorage.app",
  messagingSenderId: "593670148117",
  appId: "1:593670148117:web:62db7f45919fb0cfa13e1c",
  measurementId: "G-VFD8PVCNTN"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
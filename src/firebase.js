// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdrwjMhXt0SP88A1ayxPfheMghP-TF6sU",
  authDomain: "fullsail-pairfect-plans.firebaseapp.com",
  projectId: "fullsail-pairfect-plans",
  storageBucket: "fullsail-pairfect-plans.firebasestorage.app",
  messagingSenderId: "202737759173",
  appId: "1:202737759173:web:f8ba4c0167a9833cbbd1ac",
  measurementId: "G-1YVGVYNHW0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

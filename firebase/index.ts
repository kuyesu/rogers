import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA02ogDtAS0d7wd7SjpNII1GHjB5f0cwJ8",
  authDomain: "notefill-e0701.firebaseapp.com",
  projectId: "notefill-e0701",
  storageBucket: "notefill-e0701.appspot.com",
  messagingSenderId: "580648931190",
  appId: "1:580648931190:web:fd3f1355a8a8f679b57457",
  measurementId: "G-QCVCXTZD5C"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const timestamp = serverTimestamp();

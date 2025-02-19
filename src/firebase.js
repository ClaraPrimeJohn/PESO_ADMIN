// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUU5M-3o0wJt_8l6-w9jY-J4Yonewo3vM",
  authDomain: "peso-system-12950.firebaseapp.com",
  projectId: "peso-system-12950",
  storageBucket: "peso-system-12950.firebasestorage.app",
  messagingSenderId: "457755833156",
  appId: "1:457755833156:web:dfb202aa4eef981f1c9d11",
  measurementId: "G-Q7BRQ89CY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app); 
export const storage = getStorage(app); 
export { auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup };
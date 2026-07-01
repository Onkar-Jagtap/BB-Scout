import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "extreme-journal-6fs6l",
  appId: "1:337338231295:web:b65bdc1b25fb9a28695fca",
  apiKey: "AIzaSyBl8bDXfU3E3dY377lBI9c77wXLQ5yKSp0",
  authDomain: "extreme-journal-6fs6l.firebaseapp.com",
  storageBucket: "extreme-journal-6fs6l.firebasestorage.app",
  messagingSenderId: "337338231295"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom database ID and long polling enabled to prevent stream disconnection issues on container environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, "ai-studio-2433c187-54c7-4bd6-8a56-7fe434356dc0");

export { app, db };

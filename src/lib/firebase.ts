/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Safe helper to read environment variables in both Node.js (process.env) and Vite client (import.meta.env)
const getEnv = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Use environment variables or fallback to firebase-applet-config.json
const config = {
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || firebaseConfig.projectId,
  appId: getEnv('VITE_FIREBASE_APP_ID') || firebaseConfig.appId,
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || firebaseConfig.apiKey,
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || firebaseConfig.authDomain,
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || firebaseConfig.storageBucket,
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || firebaseConfig.messagingSenderId,
};

// Initialize Firebase
const app = initializeApp(config);

// Initialize Firestore with the custom database ID and long polling enabled to prevent stream disconnection issues on container environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, getEnv('VITE_FIREBASE_DATABASE_ID') || firebaseConfig.firestoreDatabaseId || "ai-studio-2433c187-54c7-4bd6-8a56-7fe434356dc0");

export { app, db };


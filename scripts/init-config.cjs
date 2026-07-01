const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../firebase-applet-config.json');

if (!fs.existsSync(configPath)) {
  const dummyConfig = {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "ai-studio-2433c187-54c7-4bd6-8a56-7fe434356dc0",
    appId: process.env.VITE_FIREBASE_APP_ID || "",
    apiKey: process.env.VITE_FIREBASE_API_KEY || "",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-2433c187-54c7-4bd6-8a56-7fe434356dc0"
  };
  fs.writeFileSync(configPath, JSON.stringify(dummyConfig, null, 2));
  console.log('Successfully generated fallback firebase-applet-config.json');
} else {
  console.log('firebase-applet-config.json already exists');
}

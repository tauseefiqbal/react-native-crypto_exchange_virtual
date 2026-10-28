import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Project Configuration from environment variables
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    "AIzaSyMockApiKeyForVCruptoProject123",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN ||
    "vcrupto-app.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    "vcrupto-app",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    "vcrupto-app.appspot.com",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    "123456789012",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    process.env.FIREBASE_APP_ID ||
    "1:123456789012:web:abcdef123456",
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence if available
let auth: any;
try {
  // @ts-ignore
  const { getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  try {
    // @ts-ignore
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (err) {
    auth = getAuth(app);
  }
}

// Initialize Cloud Firestore and Functions
const db = getFirestore(app);
const functions = getFunctions(app);

// Optional: Connect to local Firebase Emulators during local testing
const USE_EMULATORS = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
if (__DEV__ && USE_EMULATORS) {
  const EMULATOR_HOST = '10.0.2.2'; // Standard Android emulator localhost alias (use 'localhost' for iOS simulator)
  try {
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
    console.log('[Firebase] Connected to local Firebase Emulators');
  } catch (err) {
    console.log('[Firebase] Emulators already connected or unavailable');
  }
}

export { app, auth, db, functions };


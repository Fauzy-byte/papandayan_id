import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  onSnapshot, 
  setDoc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with robust connection settings (forcing experimentalAutoDetectLongPolling prevents WebChannel stream drops in restrictive iframes)
export const db = (() => {
  try {
    const firestoreSettings = {
      experimentalAutoDetectLongPolling: true,
      experimentalForceLongPolling: true,
    };
    if (firebaseConfig.firestoreDatabaseId) {
      return initializeFirestore(app, firestoreSettings, firebaseConfig.firestoreDatabaseId);
    }
    return initializeFirestore(app, firestoreSettings);
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

// Test connection silently on boot without interrupting UI
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch {
    // Graceful offline fallback: Firestore will use offline persistence / localStorage fallback
  }
}

// Google Sign-In helper
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google sign-in error:', err);
    throw err;
  }
}

export async function logOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

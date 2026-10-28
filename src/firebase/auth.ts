import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Subscribe to authentication state changes.
 */
export const subscribeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user synchronously.
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Sign in with email and password.
 */
export const loginWithEmail = async (email: string, pass: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
};

/**
 * Register a new user with email, password, and display name.
 */
export const registerWithEmail = async (
  email: string,
  pass: string,
  displayName?: string
) => {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = credential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Ensure user document exists in Firestore (handles cases where Cloud Functions trigger is disabled)
  await ensureUserProfile(user, displayName);
  return user;
};

/**
 * Sign in anonymously for rapid testing and demo without OAuth or passwords.
 */
export const loginAsGuest = async (nickname: string = 'Crypto Explorer') => {
  const credential = await signInAnonymously(auth);
  const user = credential.user;
  await ensureUserProfile(user, nickname);
  return user;
};

/**
 * Sign out the currently logged-in user.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Helper to ensure user doc & USD starter balance exist in Firestore.
 */
export const ensureUserProfile = async (user: User, customName?: string) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const timestamp = serverTimestamp();
    const name = customName || user.displayName || user.email?.split('@')[0] || 'Trader';
    const photoURL = user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`;

    await setDoc(userRef, {
      id: user.uid,
      email: user.email || 'guest@vcrupto.local',
      name,
      image: photoURL,
      networth: 100000.0,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const usdRef = doc(db, 'users', user.uid, 'portfolioCoins', 'usd');
    await setDoc(usdRef, {
      id: 'usd',
      coinId: 'usd',
      userId: user.uid,
      amount: 100000.0,
      updatedAt: timestamp,
    });
  }
};


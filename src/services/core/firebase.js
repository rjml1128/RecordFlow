import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Configure auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Helper function to handle auth errors
export const handleAuthError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please try logging in.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Please use Google login for this account.';
    default:
      return error.message;
  }
};

// Helper function to merge Google profile data
export const mergeGoogleProfile = async (user, googleData) => {
  if (!user || !googleData) return;

  try {
    // Get the current user profile
    const userDocRef = doc(db, 'users', user.uid);
    const userProfile = await getDoc(userDocRef);

    // Merge the profile data
    const updates = {
      displayName: user.displayName || googleData.displayName,
      photoURL: user.photoURL || googleData.photoURL,
      email: user.email || googleData.email,
      lastSignInTime: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update the user document
    await setDoc(userDocRef, updates, { merge: true });
    return updates;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default app;
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  User as FirebaseUser,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real environment, replace these placeholders with process.env / EAS secrets
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForDevOnly_xxxxx",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "lifeos-ai.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "lifeos-ai",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "lifeos-ai.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:12345:web:xxxxx"
};

let app;
let auth: any;
let isMockAuth = false;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Secure React Native auth session persistence via AsyncStorage
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    app = getApp();
    auth = getAuth(app);
  }

  // If using default mock key, we flag mock mode
  if (firebaseConfig.apiKey.includes('MockKey')) {
    isMockAuth = true;
  }
} catch (error) {
  console.warn('Firebase client failed to initialize. Activating MOCK auth mode.', error);
  isMockAuth = true;
}

export { auth, isMockAuth };

// --- Authentications Wrapper Utilities ---

export const clientLogin = async (email: string, password: string): Promise<{ token: string; email: string; uid: string }> => {
  if (isMockAuth || !auth) {
    // Generate a mock token prefix that the backend's mock-verification accepts
    const cleanPrefix = email.replace(/[^a-zA-Z0-9]/g, '');
    const token = `mock-${cleanPrefix}`;
    const mockUser = {
      token,
      email,
      uid: `mock-${cleanPrefix}`,
    };
    // Save token to AsyncStorage to persist local mock login
    await AsyncStorage.setItem('mock_auth_token', token);
    await AsyncStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    return mockUser;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  return {
    token,
    email: userCredential.user.email || email,
    uid: userCredential.user.uid,
  };
};

export const clientSignup = async (email: string, password: string): Promise<{ token: string; email: string; uid: string }> => {
  if (isMockAuth || !auth) {
    const cleanPrefix = email.replace(/[^a-zA-Z0-9]/g, '');
    const token = `mock-${cleanPrefix}`;
    const mockUser = {
      token,
      email,
      uid: `mock-${cleanPrefix}`,
    };
    await AsyncStorage.setItem('mock_auth_token', token);
    await AsyncStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
    return mockUser;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  return {
    token,
    email: userCredential.user.email || email,
    uid: userCredential.user.uid,
  };
};

export const clientLogout = async (): Promise<void> => {
  if (isMockAuth) {
    await AsyncStorage.removeItem('mock_auth_token');
    await AsyncStorage.removeItem('mock_auth_user');
    return;
  }
  if (auth) {
    await signOut(auth);
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  if (isMockAuth) {
    return AsyncStorage.getItem('mock_auth_token');
  }
  if (auth && auth.currentUser) {
    return auth.currentUser.getIdToken(true);
  }
  // Try retrieving cached token if not active
  return AsyncStorage.getItem('firebase_token_cache');
};

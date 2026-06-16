import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseApp: admin.app.App | null = null;
let isMockFirebase = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Format private key properly to handle escaped newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.warn(
      'Firebase environment variables missing. Falling back to MOCK verification mode.'
    );
    isMockFirebase = true;
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  isMockFirebase = true;
}

export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  if (isMockFirebase || !firebaseApp) {
    // Return a mocked DecodedIdToken for local development/testing when keys are not provided
    console.log('Using MOCK Firebase Token verification...');
    
    // In mock mode, the ID token is treated as the user's email/UID prefix
    const mockUid = idToken.startsWith('mock-') ? idToken : `mock-${idToken.replace(/[^a-zA-Z0-9]/g, '')}`;
    const mockEmail = `${mockUid.substring(5)}@example.com`;
    
    return {
      uid: mockUid,
      email: mockEmail,
      email_verified: true,
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/mock-project',
      aud: 'mock-project',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      sub: mockUid,
      firebase: {
        identities: {},
        sign_in_provider: 'custom',
      },
    } as admin.auth.DecodedIdToken;
  }

  return admin.auth().verifyIdToken(idToken);
};

export { firebaseApp, isMockFirebase };

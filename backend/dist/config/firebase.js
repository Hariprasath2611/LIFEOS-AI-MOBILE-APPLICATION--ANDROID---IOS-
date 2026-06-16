"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMockFirebase = exports.firebaseApp = exports.verifyFirebaseToken = void 0;
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let firebaseApp = null;
exports.firebaseApp = firebaseApp;
let isMockFirebase = false;
exports.isMockFirebase = isMockFirebase;
try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (projectId && clientEmail && privateKey) {
        // Format private key properly to handle escaped newlines
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
        exports.firebaseApp = firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: formattedPrivateKey,
            }),
        });
        console.log('Firebase Admin SDK initialized successfully.');
    }
    else {
        console.warn('Firebase environment variables missing. Falling back to MOCK verification mode.');
        exports.isMockFirebase = isMockFirebase = true;
    }
}
catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    exports.isMockFirebase = isMockFirebase = true;
}
const verifyFirebaseToken = async (idToken) => {
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
        };
    }
    return admin.auth().verifyIdToken(idToken);
};
exports.verifyFirebaseToken = verifyFirebaseToken;
//# sourceMappingURL=firebase.js.map
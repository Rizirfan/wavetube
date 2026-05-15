import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully using JSON file');
  }
} catch (error: any) {
  console.error('Firebase initialization error:', error.message);
  
  // Fallback to env if file fails
  try {
    if (!admin.apps.length && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        } as admin.ServiceAccount),
      });
    }
  } catch (innerError: any) {
    console.error('Firebase fallback also failed:', innerError.message);
  }
}

const auth: any = admin.apps.length ? admin.auth() : null;
export { auth };

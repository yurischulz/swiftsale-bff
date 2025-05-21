import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as serviceAccount from './firebaseAdminKey';

initializeApp({
  credential: cert(serviceAccount as any),
});

export const firebaseAuth = getAuth();

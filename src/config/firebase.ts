import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseAdminKeys from './firebaseAdminKeys';

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseAdminKeys as ServiceAccount),
    projectId: 'swiftsale-7e6bc',
  });
}

export const firebaseAuth = getAuth();

import { getAuth } from 'firebase-admin/auth';
import axios from 'axios';

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY!;

export const createFirebaseUser = async (
  email: string,
  password: string,
  role: string
) => {
  const userRecord = await getAuth().createUser({ email, password });
  await assignUserRole(userRecord.uid, role);
  return { uid: userRecord.uid, email: userRecord.email, role };
};

export const assignUserRole = async (uid: string, role: string) => {
  await getAuth().setCustomUserClaims(uid, { role });
};

export const removeFirebaseUser = async (uid: string) => {
  await getAuth().deleteUser(uid);
};

export const getFirebaseUser = async (uid: string) => {
  const user = await getAuth().getUser(uid);
  return {
    uid: user.uid,
    email: user.email,
    role: user.customClaims?.role || null,
  };
};

export const signInFirebaseUser = async (email: string, password: string) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`;
  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
  return response.data.idToken;
};

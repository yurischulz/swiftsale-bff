import { getAuth } from 'firebase-admin/auth';
import axios from 'axios';

const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY!;

export const createFirebaseUser = async (
  email: string,
  password: string,
  role: string
) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_WEB_API_KEY}`;
  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const uid = response.data.localId;

    await assignUserRole(uid, role);

    return { uid, email, role };
  } catch (error: any) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message === 'EMAIL_EXISTS'
    ) {
      throw new Error('E-mail já cadastrado no Firebase Authentication.');
    }
    // istanbul ignore next
    throw error;
  }
};

export const assignUserRole = async (uid: string, role: string) => {
  await getAuth().setCustomUserClaims(uid, { role });
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

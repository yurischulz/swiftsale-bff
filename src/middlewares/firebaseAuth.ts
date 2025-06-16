import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import serviceAccount from '../config/firebaseAdminKeys';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = { user_id: 'mock-user', role: 'admin', email: 'mock@mock.com' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log('Token Firebase verificado com sucesso:', decodedToken);
    next();
  } catch (err) {
    console.error('Erro ao verificar token Firebase:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

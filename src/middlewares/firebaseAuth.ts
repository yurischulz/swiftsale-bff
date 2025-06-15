import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

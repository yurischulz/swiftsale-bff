import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET || '', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
    next();
  } catch (error) {
    res.status(403).json({ message: 'Acesso negado' });
  }
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return res.sendStatus(403);
  next();
};

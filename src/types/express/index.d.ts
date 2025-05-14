import 'express';
import { User } from '../models/User';

export interface AuthUser {
  id: string;
  role: 'user' | 'admin';
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}

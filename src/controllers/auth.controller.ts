import { Request, Response } from 'express';
import {
  createFirebaseUser,
  signInFirebaseUser,
} from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, role = 'user' } = req.body;
    const user = await createFirebaseUser(email, password, role);
    res.status(201).json(user);
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await signInFirebaseUser(email, password);
  res.status(200).json({ token });
});

import { Request, Response } from 'express';
import {
  createFirebaseUser,
  signInFirebaseUser,
  assignUserRole,
  removeFirebaseUser,
  getFirebaseUser,
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

export const setRole = asyncHandler(async (req: Request, res: Response) => {
  const { uid, role } = req.body;
  await assignUserRole(uid, role);
  res.status(200).json({ message: `Role '${role}' set for UID: ${uid}` });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { uid } = req.params;
  await removeFirebaseUser(uid);
  res.status(204).send();
});

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { uid } = req.params;
  const user = await getFirebaseUser(uid);
  res.status(200).json(user);
});

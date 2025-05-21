import { Router } from 'express';
import {
  loginUser,
  registerUser,
  setRole,
  deleteUser,
  getUserInfo,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/set-role', setRole);
router.get('/user/:uid', getUserInfo);
router.delete('/user/:uid', deleteUser);

export default router;

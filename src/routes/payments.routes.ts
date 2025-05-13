import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  createPayment,
  getPaymentsByClient,
} from '../controllers/payment.controller';

const router = Router();

router.use(authenticateToken);
router.post('/', createPayment);
router.get('/by-client/:id', getPaymentsByClient);

export default router;

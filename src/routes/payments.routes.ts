import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  createPayment,
  getPaymentsByCustomer,
} from '../controllers/payment.controller';

const router = Router();

router.use(authenticateToken);
router.post('/', createPayment);
router.get('/by-customer/:id', getPaymentsByCustomer);

export default router;

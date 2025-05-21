import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import {
  createPayment,
  getPaymentsByCustomer,
} from '../controllers/payment.controller';

const router = Router();

router.use(firebaseAuthMiddleware);
router.post('/', createPayment);
router.get('/by-customer/:id', getPaymentsByCustomer);

export default router;

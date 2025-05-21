import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import { createSale, getSalesByCustomer } from '../controllers/sale.controller';

const router = Router();

router.use(firebaseAuthMiddleware);
router.post('/', createSale);
router.get('/by-customer/:id', getSalesByCustomer);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { createSale, getSalesByCustomer } from '../controllers/sale.controller';

const router = Router();

router.use(authenticateToken);
router.post('/', createSale);
router.get('/by-customer/:id', getSalesByCustomer);

export default router;

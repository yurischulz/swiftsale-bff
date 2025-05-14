import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { createSale, getSalesBycustomer } from '../controllers/sale.controller';

const router = Router();

router.use(authenticateToken);
router.post('/', createSale);
router.get('/by-customer/:id', getSalesBycustomer);

export default router;

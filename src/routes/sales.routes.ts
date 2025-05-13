import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { createSale, getSalesByClient } from '../controllers/sale.controller';

const router = Router();

router.use(authenticateToken);
router.post('/', createSale);
router.get('/by-client/:id', getSalesByClient);

export default router;

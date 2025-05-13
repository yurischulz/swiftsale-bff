import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { getDashboardSummary } from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticateToken);
router.get('/', getDashboardSummary);

export default router;

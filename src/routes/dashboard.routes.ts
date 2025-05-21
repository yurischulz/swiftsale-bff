import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import { getDashboardSummary } from '../controllers/dashboard.controller';

const router = Router();

router.use(firebaseAuthMiddleware);
router.get('/', getDashboardSummary);

export default router;

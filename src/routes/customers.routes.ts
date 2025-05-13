import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/customer.controller';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;

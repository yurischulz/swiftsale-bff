import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;

import { Router } from 'express';

import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';

import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller';

const router = Router();

router.use(firebaseAuthMiddleware);

router.get('/', getAllCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;

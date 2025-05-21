import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = Router();

router.use(firebaseAuthMiddleware);
router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

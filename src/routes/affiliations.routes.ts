import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import {
  getAllAffiliations,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} from '../controllers/affiliation.controller';

const router = Router();

router.use(firebaseAuthMiddleware);
router.get('/', getAllAffiliations);
router.post('/', createAffiliation);
router.put('/:id', updateAffiliation);
router.delete('/:id', deleteAffiliation);

export default router;

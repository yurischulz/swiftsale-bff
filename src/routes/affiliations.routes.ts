import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  getAllAffiliations,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} from '../controllers/affiliation.controller';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllAffiliations);
router.post('/', createAffiliation);
router.put('/:id', updateAffiliation);
router.delete('/:id', deleteAffiliation);

export default router;

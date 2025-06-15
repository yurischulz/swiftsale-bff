import { Router } from 'express';
import { firebaseAuthMiddleware } from '../middlewares/firebaseAuth';
import {
  getAllAffiliations,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} from '~/controllers/affiliation.controller';
import {
  validateAffiliationBody,
  validateAffiliationUpdateBody,
  validateIdParam,
} from './validators/affiliations.validator';

const router = Router();

router.use(firebaseAuthMiddleware);

/**
 * @swagger
 * /affiliations:
 *   get:
 *     summary: Lista todas as afiliações
 *     tags: [Affiliations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de afiliações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   totalDebt:
 *                     type: number
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: number
 */
router.get('/', getAllAffiliations);

/**
 * @swagger
 * /affiliations:
 *   post:
 *     summary: Cria uma nova afiliação
 *     tags: [Affiliations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - name
 *               - address
 *               - phone
 *     responses:
 *       201:
 *         description: Afiliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 */
router.post('/', validateAffiliationBody, createAffiliation);

/**
 * @swagger
 * /affiliations/{id}:
 *   put:
 *     summary: Atualiza uma afiliação existente
 *     tags: [Affiliations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da afiliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               totalDebt:
 *                 type: number
 *     responses:
 *       200:
 *         description: Afiliação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 */
router.put(
  '/:id',
  validateIdParam,
  validateAffiliationUpdateBody,
  updateAffiliation
);

/**
 * @swagger
 * /affiliations/{id}:
 *   delete:
 *     summary: Remove uma afiliação
 *     tags: [Affiliations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da afiliação
 *     responses:
 *       204:
 *         description: Afiliação removida com sucesso
 */

router.delete('/:id', validateIdParam, deleteAffiliation);

export default router;

import { Router } from 'express';
import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';
import {
  createPayment,
  getPaymentsByCustomer,
} from '~/controllers/payment.controller';
import {
  validatePaymentBody,
  validatePaymentCustomerIdParam,
} from './validators/payment.validator';

const router = Router();

router.use(firebaseAuthMiddleware);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - customer
 *               - amount
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customerId:
 *                   type: string
 *                 value:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 */
router.post('/', validatePaymentBody, createPayment);

/**
 * @swagger
 * /payments/customer/{id}:
 *   get:
 *     summary: Lista os pagamentos de um cliente
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de pagamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   customer:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: number
 */
router.get(
  '/customer/:id',
  validatePaymentCustomerIdParam,
  getPaymentsByCustomer
);

export default router;

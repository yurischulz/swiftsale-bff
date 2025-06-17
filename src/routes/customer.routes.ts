import { Router } from 'express';

import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';

import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '~/controllers/customer.controller';
import {
  validateCustomerBody,
  validateCustomerUpdateBody,
  validateCustomerIdParam,
} from './validators/customer.validator';

const router = Router();

router.use(firebaseAuthMiddleware);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
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
 *                   document:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   affiliation:
 *                     type: string
 *                   credit:
 *                     type: number
 *                   debt:
 *                     type: number
 *                   createdBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   __v:
 *                     type: number
 */
router.get('/', getAllCustomers);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Customers]
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
 *               document:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - document
 *               - phone
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 document:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 affiliation:
 *                   type: string
 *                 credit:
 *                   type: number
 *                 debit:
 *                   type: number
 *                 createdBy:
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
router.post('/', validateCustomerBody, createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               document:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               affiliation:
 *                 type: string
 *               credit:
 *                 type: number
 *               debt:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 affiliation:
 *                   type: string
 *                 credit:
 *                   type: number
 *                 debt:
 *                   type: number
 *                 createdBy:
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
router.put('/:id', validateCustomerUpdateBody, updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Customers]
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
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id', validateCustomerIdParam, deleteCustomer);

export default router;

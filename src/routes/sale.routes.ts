import { Router } from 'express';
import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';
import { createSale, getSalesByCustomer } from '~/controllers/sale.controller';
import {
  validateSaleBody,
  validateSaleIdParam,
} from './validators/sale.validator';

const router = Router();

router.use(firebaseAuthMiddleware);

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Sales]
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
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *               total:
 *                 type: number
 *             required:
 *               - customer
 *               - products
 *               - total
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customer:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       unitPrice:
 *                         type: number
 *                       _id:
 *                         type: string
 *                 total:
 *                   type: number
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 */
router.post('/', validateSaleBody, createSale);

/**
 * @swagger
 * /sales/customer/{id}:
 *   get:
 *     summary: Lista as vendas de um cliente
 *     tags: [Sales]
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
 *         description: Lista de vendas retornada com sucesso
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
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         unitPrice:
 *                           type: number
 *                         _id:
 *                           type: string
 *                   total:
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
router.get('/customer/:id', validateSaleIdParam, getSalesByCustomer);

export default router;

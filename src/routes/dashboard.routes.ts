import { Router } from 'express';
import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';
import { getDashboardSummary } from '~/controllers/dashboard.controller';

const router = Router();

router.use(firebaseAuthMiddleware);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna o resumo do dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo do dashboard retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topCustomers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       document:
 *                        type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                        type: string
 *                       address:
 *                         type: string
 *                       affiliation:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           address:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           totalDebt:
 *                             type: number
 *                           createdBy:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           __v:
 *                             type: number
 *                       credit:
 *                         type: number
 *                       debt:
 *                         type: number
 *                       createdBy:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: number
 *                 topAffiliations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       totalDebt:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       createdBy:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: number
 *                 totalCustomers:
 *                   type: number
 *                 totalPayments:
 *                   type: number
 *                 totalSales:
 *                   type: number
 *                 totalPaymentsAmount:
 *                   type: number
 *                 totalSalesAmount:
 *                   type: number
 */
router.get('/', getDashboardSummary);

export default router;

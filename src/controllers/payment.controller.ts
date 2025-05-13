import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as paymentService from '../services/payment.service';

// Cria um novo pagamento
export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  }
);

// Obtém pagamentos por cliente
export const getPaymentsByClient = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params; // ID do cliente
    const payments = await paymentService.getPaymentsByClient(id);
    res.status(200).json(payments);
  }
);

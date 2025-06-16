import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as paymentService from '~/services/payment.service';

export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await paymentService.createPayment(req.body, req.user.uid);
    res.status(201).json(payment);
  }
);

export const getPaymentsByCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const payments = await paymentService.getPaymentsByCustomer(
      req.params.id,
      req.user.uid
    );
    if (!payments) {
      return res.status(404).json({ message: 'Nenhum pagamento encontrado.' });
    }
    res.status(200).json(payments);
  }
);

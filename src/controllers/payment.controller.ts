import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as paymentService from '~/services/payment.service';

export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  }
);

export const getPaymentsByCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payments = await paymentService.getPaymentsByCustomer(id);
    res.status(200).json(payments);
  }
);

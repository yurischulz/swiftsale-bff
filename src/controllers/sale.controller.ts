import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as saleService from '~/services/sale.service';

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.createSale(req.body, req.user.uid);
  res.status(201).json(sale);
});

export const getSalesByCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const sales = await saleService.getSalesByCustomer(
      req.params.id,
      req.user.uid
    );
    res.status(200).json(sales);
  }
);

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as saleService from '../services/sale.service';

// Cria uma nova venda
export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.createSale(req.body);
  res.status(201).json(sale);
});

// Obtém todas as vendas
export const getSalesByCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const sales = await saleService.getSalesByCustomer(req, res);
    res.status(200).json(sales);
  }
);

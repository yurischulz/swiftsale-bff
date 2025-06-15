import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as customerService from '~/services/customer.service';

export const getAllCustomers = asyncHandler(
  async (_req: Request, res: Response) => {
    const customers = await customerService.getAllCustomers();
    return res.status(200).send(customers);
  }
);

export const createCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  }
);

export const updateCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await customerService.updateCustomer(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(200).json(updated);
  }
);

export const deleteCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await customerService.deleteCustomer(id);
    if (!deleted) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(204).send();
  }
);

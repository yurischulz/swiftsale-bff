import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as customerService from '~/services/customer.service';

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const customers = await customerService.getAllCustomers(req.user.uid);
    return res.status(200).send(customers);
  }
);

export const createCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = await customerService.createCustomer(
      req.body,
      req.user.uid
    );
    res.status(201).json(customer);
  }
);

export const updateCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await customerService.updateCustomer(
      req.params.id,
      req.body,
      req.user.uid
    );
    if (!updated) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(200).json(updated);
  }
);

export const deleteCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const deleted = await customerService.deleteCustomer(
      req.params.id,
      req.user.uid
    );
    if (!deleted) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(204).send();
  }
);

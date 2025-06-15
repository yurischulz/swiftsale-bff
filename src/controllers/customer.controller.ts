import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as customerService from '~/services/customer.service';

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    console.log('getAllCustomers called');
    const customers = await customerService.getAllCustomers();
    console.log('Customers encontrados:', customers);
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
    const updatedCustomer = await customerService.updateCustomer(id, req.body);
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(200).json(updatedCustomer);
  }
);

export const deleteCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedCustomer = await customerService.deleteCustomer(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'customer não encontrado' });
    }
    res.status(204).send();
  }
);

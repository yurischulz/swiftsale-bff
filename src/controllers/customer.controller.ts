import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as clientService from '../services/customer.service';

export const getAllClients = asyncHandler(
  async (req: Request, res: Response) => {
    const clients = await clientService.getAllClients();
    res.status(200).json(clients);
  }
);

export const createClient = asyncHandler(
  async (req: Request, res: Response) => {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  }
);

export const updateClient = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedClient = await clientService.updateClient(id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(updatedClient);
  }
);

export const deleteClient = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedClient = await clientService.deleteClient(id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  }
);

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as affiliationService from '../services/affiliation.service';

export const getAllAffiliations = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await affiliationService.getAllAffiliations();
    res.json(result);
  }
);

export const createAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await affiliationService.createAffiliation(req.body);
    res.status(201).json(result);
  }
);

export const updateAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    await affiliationService.updateAffiliation(req.params.id, req.body);
    const result = await affiliationService.getAffiliationById(req.params.id);
    res.status(200).json(result);
  }
);

export const deleteAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    await affiliationService.deleteAffiliation(req.params.id);
    res.status(204).send();
  }
);

import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as affiliationService from '~/services/affiliation.service';

export const getAllAffiliations = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await affiliationService.getAllAffiliations(req.user.uid);
    res.json(result);
  }
);

export const createAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await affiliationService.createAffiliation(
      req.body,
      req.user.uid
    );
    res.status(201).json(result);
  }
);

export const updateAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    const updated = await affiliationService.updateAffiliation(
      req.params.id,
      req.body,
      req.user.uid
    );
    if (!updated) {
      return res.status(404).json({ message: 'Afiliação não encontrada' });
    }
    const result = await affiliationService.getAffiliationById(
      req.params.id,
      req.user.uid
    );
    res.status(200).json(result);
  }
);

export const deleteAffiliation = asyncHandler(
  async (req: Request, res: Response) => {
    const deleted = await affiliationService.deleteAffiliation(
      req.params.id,
      req.user.uid
    );
    if (!deleted) {
      return res.status(404).json({ message: 'Afiliação não encontrada' });
    }
    res.status(204).send();
  }
);

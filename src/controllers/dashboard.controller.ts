import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as dashboardService from '../services/dashboard.service';

export const getDashboardSummary = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await dashboardService.getDashboardSummary();
    res.json(result);
  }
);

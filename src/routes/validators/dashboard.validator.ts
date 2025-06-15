import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

type SchemaLocation = 'body' | 'params' | 'query';

function validate(
  schema: Joi.ObjectSchema,
  location: SchemaLocation = 'query',
  customMsg?: string
) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req[location]);
    if (error) {
      return res
        .status(400)
        .json({ message: customMsg || error.details[0].message });
    }
    next();
  };
}

// Exemplo de schema para filtros futuros
const dashboardQuerySchema = Joi.object({
  // Exemplo: filtro por data
  // startDate: Joi.date().iso(),
  // endDate: Joi.date().iso(),
});

export const validateDashboardQuery = validate(dashboardQuerySchema, 'query');

import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

type SchemaLocation = 'body' | 'params' | 'query';

function validate(
  schema: ObjectSchema | Joi.StringSchema,
  location: SchemaLocation = 'body',
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

const affiliationBodySchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
});

const affiliationUpdateBodySchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  phone: Joi.string(),
  totalDebt: Joi.number(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const validateAffiliationBody = validate(affiliationBodySchema);
export const validateAffiliationUpdateBody = validate(
  affiliationUpdateBodySchema
);
export const validateIdParam = validate(
  idParamSchema,
  'params',
  'Formato de ID inválido'
);

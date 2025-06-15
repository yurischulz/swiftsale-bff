import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

type SchemaLocation = 'body' | 'params' | 'query';

function validate(
  schema: ObjectSchema,
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

const productBodySchema = Joi.object({
  name: Joi.string().required(),
  unitPrice: Joi.number().positive().required(),
});

const productUpdateBodySchema = Joi.object({
  name: Joi.string(),
  unitPrice: Joi.number().positive(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const validateProductBody = validate(productBodySchema);
export const validateProductUpdateBody = validate(productUpdateBodySchema);
export const validateProductIdParam = validate(
  idParamSchema,
  'params',
  'Formato de ID inválido'
);

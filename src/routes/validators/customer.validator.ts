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

const customerBodySchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string(),
  address: Joi.string(),
});

const customerUpdateBodySchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  credit: Joi.number(),
  debt: Joi.number(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const validateCustomerBody = validate(customerBodySchema);
export const validateCustomerUpdateBody = validate(customerUpdateBodySchema);
export const validateCustomerIdParam = validate(
  idParamSchema,
  'params',
  'Formato de ID inválido'
);

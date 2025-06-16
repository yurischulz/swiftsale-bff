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

const saleBodySchema = Joi.object({
  customer: Joi.string().length(24).hex().required(),
  affiliation: Joi.string().length(24).hex().optional(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().length(24).hex().required(),
        quantity: Joi.number().integer().positive().required(),
        unitPrice: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
  total: Joi.number().positive().required(),
  date: Joi.date().iso(),
});

const saleUpdateBodySchema = Joi.object({
  customer: Joi.string().length(24).hex(),
  affiliation: Joi.string().length(24).hex(),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().length(24).hex().required(),
      quantity: Joi.number().integer().positive().required(),
      unitPrice: Joi.number().positive().required(),
    })
  ),
  total: Joi.number().positive(),
  date: Joi.date().iso(),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const validateSaleBody = validate(saleBodySchema);
export const validateSaleUpdateBody = validate(saleUpdateBodySchema);
export const validateSaleIdParam = validate(
  idParamSchema,
  'params',
  'Formato de ID inválido'
);

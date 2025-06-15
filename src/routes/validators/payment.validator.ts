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

const paymentBodySchema = Joi.object({
  customer: Joi.string().length(24).hex().required(),
  amount: Joi.number().positive().required(),
});

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const validatePaymentBody = validate(paymentBodySchema);
export const validatePaymentCustomerIdParam = validate(
  idParamSchema,
  'params',
  'Formato de ID inválido'
);

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

const authBodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateAuthBody = validate(authBodySchema);

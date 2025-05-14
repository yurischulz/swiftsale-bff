import mongoose, { CallbackError, Document } from 'mongoose';
import { AppError } from '../utils/AppError';

mongoose.plugin((schema) => {
  schema.post('save', errorHandlerPlugin);
  schema.post('find', errorHandlerPlugin);
  schema.post('findOne', errorHandlerPlugin);
  schema.post('insertMany', errorHandlerPlugin);
  schema.post('updateOne', errorHandlerPlugin);
  schema.post('deleteOne', errorHandlerPlugin);
});

function errorHandlerPlugin(
  error: CallbackError,
  doc: Document,
  next: (err?: CallbackError) => void
) {
  if (error instanceof mongoose.Error.CastError) {
    next(new AppError(`ID inválido para campo '${error.path}'`, 400));
  } else {
    next(error);
  }
}

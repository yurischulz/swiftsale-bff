import { Request, Response, NextFunction } from 'express';
import { AppError } from '~/utils/AppError';
import { v4 as uuidv4 } from 'uuid';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Erro capturado pelo middleware de erro:', err);
  if (res.headersSent) {
    return next(err);
  }
  const traceId = uuidv4();
  const status = err.status || err.statusCode || 500;

  console.error(`[🔥 ${traceId}]`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    body: req.body,
  });

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: true,
      message: `Formato de ID inválido para campo '${err.path}'`,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: err.message || 'Dados inválidos',
    });
  }

  return res.status(status).json({
    error: true,
    message: err.message || 'Erro interno no servidor',
    traceId,
    timestamp: new Date().toISOString(),
  });
}

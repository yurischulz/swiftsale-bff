import { errorHandler } from '~/middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/test',
      params: { id: '123' },
      body: { name: 'Test' },
    };
    res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve lidar com erros do tipo CastError', () => {
    const err = {
      name: 'CastError',
      path: 'id',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: `Formato de ID inválido para campo 'id'`,
    });
  });

  it('deve lidar com erros do tipo ValidationError', () => {
    const err = {
      name: 'ValidationError',
      message: 'Campo obrigatório ausente',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Campo obrigatório ausente',
    });
  });

  it('deve retornar erro 400 com mensagem padrão "Dados inválidos" se ValidationError não tiver mensagem', () => {
    const err = {
      name: 'ValidationError',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Dados inválidos',
    });
  });

  it('deve retornar erro 500 com mensagem padrão "Erro interno no servidor" se não houver mensagem no erro', () => {
    const err = {
      name: 'InternalError',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Erro interno no servidor',
      traceId: expect.any(String),
      timestamp: expect.any(String),
    });
  });

  it('deve retornar erro interno no servidor para outros tipos de erro', () => {
    const err = {
      name: 'InternalError',
      message: 'Erro interno',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Erro interno',
      traceId: expect.any(String),
      timestamp: expect.any(String),
    });
  });

  it('deve chamar next se headers já foram enviados', () => {
    res.headersSent = true;
    const err = {
      name: 'InternalError',
      message: 'Erro interno',
    };

    errorHandler(err, req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

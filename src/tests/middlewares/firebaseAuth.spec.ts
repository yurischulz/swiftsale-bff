import { firebaseAuthMiddleware } from '~/middlewares/firebaseAuth';
import { Request, Response, NextFunction } from 'express';

const verifyIdTokenMock = jest.fn();
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(() => ({
    verifyIdToken: verifyIdTokenMock,
  })),
}));

describe('firebaseAuthMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
    } as Partial<Request>;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve passar no middleware em ambiente de teste', async () => {
    process.env.NODE_ENV = 'test';

    await firebaseAuthMiddleware(req as Request, res as Response, next);

    expect(req.user).toEqual({
      uid: 'aFT85PCVPccX0Z6Zi0zTzezChvs2',
      user_id: 'aFT85PCVPccX0Z6Zi0zTzezChvs2',
      role: 'admin',
      email: 'mock@mock.com',
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar erro 401 se o token estiver ausente', async () => {
    process.env.NODE_ENV = 'development';

    await firebaseAuthMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Token ausente ou inválido',
    });
  });

  it('deve retornar erro 401 se o token for inválido', async () => {
    process.env.NODE_ENV = 'development';
    req.headers = { authorization: 'Bearer token-invalido' };
    verifyIdTokenMock.mockRejectedValue(new Error('Invalid token'));

    await firebaseAuthMiddleware(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
  });

  it('deve passar no middleware se o token for válido', async () => {
    process.env.NODE_ENV = 'development';
    process.env.NODE_ENV = 'development';
    req.headers!.authorization = 'Bearer valid-token';
    verifyIdTokenMock.mockResolvedValue({
      user_id: 'valid-user',
      role: 'user',
      email: 'valid@user.com',
    });

    await firebaseAuthMiddleware(req as Request, res as Response, next);
    expect(req.user).toEqual({
      user_id: 'valid-user',
      role: 'user',
      email: 'valid@user.com',
    });
    expect(next).toHaveBeenCalled();
  });
});

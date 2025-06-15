import jwt from 'jsonwebtoken';

/**
 * Gera um token de teste com payload customizável.
 * @param payload Dados do usuário para o token.
 * @param options Opções extras do JWT.
 * @returns string Token JWT assinado.
 */
export function generateTestJWT(
  payload: Record<string, any> = {},
  options: jwt.SignOptions = {}
) {
  const defaultPayload = {
    user_id: 'mock-user',
    role: 'admin',
    email: 'mock@mock.com',
    ...payload,
  };

  return jwt.sign(defaultPayload, process.env.JWT_SECRET!, {
    expiresIn: '1h',
    ...options,
  });
}

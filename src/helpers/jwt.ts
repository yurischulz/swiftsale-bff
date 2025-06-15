import jwt from 'jsonwebtoken';

export function generateTestJWT(
  payload = { user_id: 'mock-user', role: 'admin', email: 'mock@mock.com' }
) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
}

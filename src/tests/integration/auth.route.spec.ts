import request from 'supertest';
import app from '~/app';

describe('Auth Routes', () => {
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  describe('POST /auth/register', () => {
    it('should register a new user and return 201', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', testEmail);
      expect(res.body).toHaveProperty('uid');
      expect(res.body).toHaveProperty('role');
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: testEmail });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials and return a token', async () => {
      // Ensure user is registered first
      await request(app)
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword });

      const res = await request(app)
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testEmail });

      expect(res.status).toBe(400);
    });
  });
});

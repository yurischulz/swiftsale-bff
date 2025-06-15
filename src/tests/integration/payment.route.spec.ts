import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
import { Payment } from '~/models/Payment';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Payment Routes', () => {
  describe('POST /payments', () => {
    it('deve criar um novo pagamento e atualizar o cliente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Pagamento',
        email: 'pagamento@email.com',
        phone: '123',
        debt: 100,
        credit: 0,
        address: 'Rua Exemplo, 123',
      });

      const payload = { customer: customer._id, amount: 50 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 50);

      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toHaveProperty('debt', 50);
      expect(updatedCustomer).toHaveProperty('credit', 50);
    });

    it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app).post('/payments').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it.skip('deve retornar erro se cliente não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const payload = { customer: fakeId, amount: 50 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /payments/customer/:id', () => {
    it('deve retornar todos os pagamentos de um cliente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Pagamento',
        email: 'pagamento@email.com',
        phone: '123',
        debt: 100,
        credit: 0,
        address: 'Rua Exemplo, 123',
      });

      await Payment.create([
        { customer: customer._id, amount: 50 },
        { customer: customer._id, amount: 30 },
      ]);

      const res = await request(app).get(`/payments/customer/${customer._id}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('amount', 50);
      expect(res.body[1]).toHaveProperty('amount', 30);
    });

    it('deve retornar erro se cliente não existir', async () => {
      const fakeId = '683f6095573ffb0ca53877c2';
      const res = await request(app).get(`/payments/customer/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app).get('/payments/customer/id-invalido');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});

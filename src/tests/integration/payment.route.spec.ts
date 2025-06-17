import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
import { Payment } from '~/models/Payment';
import { createdBy } from '../__mocks__/firebase';

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
        document: '12345678901',
        phone: '123',
        debt: 100,
        credit: 0,
        address: 'Rua Exemplo, 123',
        createdBy,
      });

      const payload = { customer: customer._id, amount: 50 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 50);

      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toHaveProperty('debt', 50);
      expect(updatedCustomer).toHaveProperty('credit', 0);
    });

    it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app).post('/payments').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /payments', () => {
    it('deve criar pagamento e gerar crédito se valor maior que dívida', async () => {
      const customer = await Customer.create({
        name: 'Cliente Crédito',
        email: 'credito@email.com',
        document: '12345678901',
        phone: '123',
        debt: 40,
        credit: 0,
        address: 'Rua Exemplo, 123',
        createdBy,
      });

      const payload = { customer: customer._id, amount: 60 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 60);

      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toHaveProperty('debt', 0);
      expect(updatedCustomer).toHaveProperty('credit', 20);
    });

    it('deve criar pagamento para um cliente que não possui debit e credit', async () => {
      const customer = await Customer.create({
        name: 'Cliente Sem Débito',
        email: 'semdebito@email.com',
        document: '12345678901',
        phone: '123',
        address: 'Rua Exemplo, 123',
        createdBy,
      });

      const payload = { customer: customer._id, amount: 25 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 25);

      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toHaveProperty('debt', 0);
      expect(updatedCustomer).toHaveProperty('credit', 25);
    });

    it('deve criar pagamento mesmo se cliente não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const payload = { customer: fakeId, amount: 10 };
      const res = await request(app).post('/payments').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 10);

      const updatedCustomer = await Customer.findById(fakeId);
      expect(updatedCustomer).toBeNull();
    });
  });

  describe('GET /payments/customer/:id', () => {
    it('deve retornar todos os pagamentos de um cliente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Pagamento',
        email: 'pagamento@email.com',
        document: '12345678901',
        phone: '123',
        debt: 100,
        credit: 0,
        address: 'Rua Exemplo, 123',
        createdBy,
      });

      await Payment.create([
        { customer: customer._id, amount: 50, createdBy },
        { customer: customer._id, amount: 30, createdBy },
      ]);

      const res = await request(app).get(`/payments/customer/${customer._id}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);

      const sortedPayments = res.body.sort(
        (a: any, b: any) => b.amount - a.amount
      );

      expect(sortedPayments[0]).toHaveProperty('amount', 50);
      expect(sortedPayments[1]).toHaveProperty('amount', 30);
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

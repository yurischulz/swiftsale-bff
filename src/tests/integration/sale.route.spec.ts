import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
import { Product } from '~/models/Product';
import { Sale } from '~/models/Sale';

let mongoServer: MongoMemoryServer;
let validToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  validToken = 'Bearer valid-token';
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

describe('Sale Routes', () => {
  describe('POST /sales', () => {
    it('deve criar uma nova venda', async () => {
      const customer = await Customer.create({
        name: 'Cliente Venda',
        email: 'venda@email.com',
        phone: '123',
        debt: 0,
        credit: 0,
        address: 'Rua Teste, 123',
      });

      const product1 = await Product.create({
        name: 'Produto 1',
        unitPrice: 100,
      });
      const product2 = await Product.create({
        name: 'Produto 2',
        unitPrice: 200,
      });

      const payload = {
        customer: customer._id,
        affiliation: new mongoose.Types.ObjectId(),
        products: [
          { product: product1._id, quantity: 2, unitPrice: 100 },
          { product: product2._id, quantity: 1, unitPrice: 200 },
        ],
        total: 400,
        date: new Date().toISOString(),
      };

      const res = await request(app)
        .post('/sales')
        .set('Authorization', validToken)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('total', 400);
      expect(res.body.products.length).toBe(2);
    });

    it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app)
        .post('/sales')
        .set('Authorization', validToken)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it.skip('deve retornar erro se cliente não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const payload = {
        customer: fakeId,
        products: [{ product: fakeId, quantity: 1, unitPrice: 100 }],
        total: 100,
      };

      const res = await request(app)
        .post('/sales')
        .set('Authorization', validToken)
        .send(payload);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /sales/customer/:id', () => {
    it('deve retornar todas as vendas de um cliente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Venda',
        email: 'venda@email.com',
        phone: '123',
        debt: 0,
        credit: 0,
        address: 'Rua Teste, 123',
      });

      const product1 = await Product.create({
        name: 'Produto 1',
        unitPrice: 100,
      });
      const product2 = await Product.create({
        name: 'Produto 2',
        unitPrice: 200,
      });

      await Sale.create([
        {
          customer: customer._id,
          products: [{ product: product1._id, quantity: 2, unitPrice: 100 }],
          total: 200,
        },
        {
          customer: customer._id,
          products: [{ product: product2._id, quantity: 1, unitPrice: 200 }],
          total: 200,
        },
      ]);

      const res = await request(app)
        .get(`/sales/customer/${customer._id}`)
        .set('Authorization', validToken);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('total', 200);
      expect(res.body[1]).toHaveProperty('total', 200);
    });

    it.skip('deve retornar erro se cliente não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/sales/customer/${fakeId}`)
        .set('Authorization', validToken);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app)
        .get('/sales/customer/id-invalido')
        .set('Authorization', validToken);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});

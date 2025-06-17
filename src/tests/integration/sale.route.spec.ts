import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
import { Product } from '~/models/Product';
import { Sale } from '~/models/Sale';
import { createdBy } from '../__mocks__/firebase';

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
        document: '12345678901',
        phone: '123',
        debt: 0,
        credit: 0,
        address: 'Rua Teste, 123',
        createdBy,
      });

      const product1 = await Product.create({
        name: 'Produto 1',
        unitPrice: 100,
        createdBy,
      });
      const product2 = await Product.create({
        name: 'Produto 2',
        unitPrice: 200,
        createdBy,
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

    it('deve usar crédito do cliente para pagar a venda completamente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Teste',
        email: 'cliente@email.com',
        phone: '123456789',
        address: 'Rua Teste, 123',
        credit: 200,
        debt: 0,
        createdBy,
      });

      const product = await Product.create({
        name: 'Produto Teste',
        unitPrice: 100,
        createdBy,
      });

      const payload = {
        customer: customer._id,
        products: [{ product: product._id, quantity: 2, unitPrice: 100 }],
        total: 200,
      };

      const res = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer valid-token`)
        .send(payload);

      expect(res.status).toBe(201);
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer?.credit).toBe(0);
      expect(updatedCustomer?.debt).toBe(0);
    });

    it('deve usar crédito do cliente parcialmente e adicionar o restante ao débito', async () => {
      const customer = await Customer.create({
        name: 'Cliente Teste',
        email: 'cliente@email.com',
        phone: '123456789',
        address: 'Rua Teste, 123',
        credit: 100,
        debt: 0,
        createdBy,
      });

      const product = await Product.create({
        name: 'Produto Teste',
        unitPrice: 100,
        createdBy,
      });

      const payload = {
        customer: customer._id,
        products: [{ product: product._id, quantity: 3, unitPrice: 100 }],
        total: 300,
      };

      const res = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer valid-token`)
        .send(payload);

      expect(res.status).toBe(201);
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer?.credit).toBe(0);
      expect(updatedCustomer?.debt).toBe(200);
    });

    it('deve adicionar o total da venda ao débito do cliente quando não há crédito', async () => {
      const customer = await Customer.create({
        name: 'Cliente Teste',
        email: 'cliente@email.com',
        phone: '123456789',
        address: 'Rua Teste, 123',
        credit: 0,
        debt: 0,
        createdBy,
      });

      const product = await Product.create({
        name: 'Produto Teste',
        unitPrice: 100,
        createdBy,
      });

      const payload = {
        customer: customer._id,
        products: [{ product: product._id, quantity: 2, unitPrice: 100 }],
        total: 200,
      };

      const res = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer valid-token`)
        .send(payload);

      expect(res.status).toBe(201);
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer?.credit).toBe(0);
      expect(updatedCustomer?.debt).toBe(200);
    });
  });

  describe('GET /sales/customer/:id', () => {
    it('deve retornar todas as vendas de um cliente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Venda',
        email: 'venda@email.com',
        document: '12345678901',
        phone: '123',
        debt: 0,
        credit: 0,
        address: 'Rua Teste, 123',
        createdBy,
      });

      const product1 = await Product.create({
        name: 'Produto 1',
        unitPrice: 100,
        createdBy,
      });
      const product2 = await Product.create({
        name: 'Produto 2',
        unitPrice: 200,
        createdBy,
      });

      await Sale.create([
        {
          customer: customer._id,
          products: [
            { product: product1._id, quantity: 2, unitPrice: 100, createdBy },
          ],
          total: 200,
          createdBy,
        },
        {
          customer: customer._id,
          products: [
            { product: product2._id, quantity: 1, unitPrice: 200, createdBy },
          ],
          total: 200,
          createdBy,
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

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app)
        .get('/sales/customer/id-invalido')
        .set('Authorization', validToken);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});

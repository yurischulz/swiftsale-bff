import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
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

describe('Customer Routes', () => {
  describe('GET /customers', () => {
    it('deve retornar lista vazia se não houver clientes', async () => {
      const res = await request(app).get('/customers');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('deve retornar todos os clientes cadastrados', async () => {
      await Customer.create({
        name: 'Cliente 1',
        email: 'c1@email.com',
        phone: '111',
        address: 'Rua 1',
        document: '123456789',
        createdBy,
      });
      await Customer.create({
        name: 'Cliente 2',
        email: 'c2@email.com',
        phone: '222',
        address: 'Rua 2',
        document: '987654321',
        createdBy,
      });

      const res = await request(app).get('/customers');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
    });
  });

  describe('POST /customers', () => {
    it('deve criar um novo cliente', async () => {
      const payload = {
        name: 'Novo Cliente',
        email: 'novo@email.com',
        phone: '123',
        address: 'Rua Teste',
        document: '123456789',
      };
      const res = await request(app).post('/customers').send(payload);
      console.log('Response:', res);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
      });
      expect(res.body).toHaveProperty('_id');
    });

    it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app).post('/customers').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /customers/:id', () => {
    it('deve atualizar um cliente existente', async () => {
      const customer = await Customer.create({
        name: 'Cliente Atualizar',
        email: 'atualizar@email.com',
        phone: '999',
        address: 'Rua Antiga',
        createdBy,
      });
      const res = await request(app).put(`/customers/${customer._id}`).send({
        address: 'Rua Atualizada',
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('address', 'Rua Atualizada');
    });

    it('deve retornar 400 ao tentar atualizar cliente inexistente', async () => {
      const fakeId = '683f6095573ffb0ca53877c2';
      const res = await request(app)
        .put(`/customers/${fakeId}`)
        .send({ name: 'Qualquer', email: 'q@email.com', phone: '000' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar 400 se id for inválido', async () => {
      const res = await request(app)
        .put('/customers/id-invalido')
        .send({ name: 'Qualquer', email: 'q@email.com', phone: '000' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar erro se payload de atualização for vazio', async () => {
      const customer = await Customer.create({
        name: 'Cliente Atualizar',
        email: 'atualizar2@email.com',
        phone: '999',
        address: 'Rua Antiga',
        createdBy,
      });
      const res = await request(app).put(`/customers/${customer._id}`).send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /customers/:id', () => {
    it('deve remover um cliente existente', async () => {
      const customer = await Customer.create({
        name: 'Remover',
        email: 'remover@email.com',
        phone: '888',
        address: 'Rua Remover',
        createdBy,
      });
      const res = await request(app).delete(`/customers/${customer._id}`);
      expect(res.status).toBe(204);

      const check = await Customer.findById(customer._id);
      expect(check).toBeNull();
    });

    it('deve retornar 404 ao tentar remover cliente inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/customers/${fakeId}`);
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se id for inválido', async () => {
      const res = await request(app).delete('/customers/id-invalido');
      expect(res.status).toBe(400);
    });
  });
});

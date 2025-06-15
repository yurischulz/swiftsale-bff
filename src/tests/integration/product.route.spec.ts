import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Product } from '~/models/Product';

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

describe('Product Routes', () => {
  describe('GET /products', () => {
    it('deve retornar lista vazia se não houver produtos', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('deve retornar todos os produtos cadastrados', async () => {
      await Product.create([
        { name: 'Produto 1', unitPrice: 100 },
        { name: 'Produto 2', unitPrice: 200 },
      ]);

      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name', 'Produto 1');
      expect(res.body[1]).toHaveProperty('name', 'Produto 2');
    });
  });

  describe('POST /products', () => {
    it('deve criar um novo produto', async () => {
      const payload = { name: 'Novo Produto', unitPrice: 150 };
      const res = await request(app).post('/products').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toMatchObject(payload);
    });

    it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app).post('/products').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /products/:id', () => {
    it('deve atualizar um produto existente', async () => {
      const product = await Product.create({
        name: 'Produto Atualizar',
        unitPrice: 100,
        stock: 10,
      });
      const res = await request(app)
        .put(`/products/${product._id}`)
        .send({ unitPrice: 150 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('unitPrice', 150);
    });

    it('deve retornar erro se produto não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/products/${fakeId}`)
        .send({ unitPrice: 150 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app)
        .put('/products/id-invalido')
        .send({ unitPrice: 150 });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /products/:id', () => {
    it('deve remover um produto existente', async () => {
      const product = await Product.create({
        name: 'Produto Remover',
        unitPrice: 100,
        stock: 10,
      });
      const res = await request(app).delete(`/products/${product._id}`);

      expect(res.status).toBe(204);

      const check = await Product.findById(product._id);
      expect(check).toBeNull();
    });

    it('deve retornar erro se produto não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar erro se id for inválido', async () => {
      const res = await request(app).delete('/products/id-invalido');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';
import { Customer } from '~/models/Customer';
import { Affiliation } from '~/models/Affiliation';

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

describe('Dashboard Routes', () => {
  describe('GET /dashboard', () => {
    it('deve retornar resumo vazio se não houver dados', async () => {
      const res = await request(app)
        .get('/dashboard')
        .set('Authorization', validToken);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        topCustomers: [],
        topAffiliations: [],
        totalCustomers: 0,
        totalPayments: 0,
        totalSales: 0,
      });
    });

    it('deve retornar resumo com dados de clientes e afiliados', async () => {
      const affiliation = await Affiliation.create([
        {
          name: 'Afiliado 1',
          address: 'Endereço 1',
          phone: '333',
          totalDebt: 300,
        },
        {
          name: 'Afiliado 2',
          address: 'Endereço 2',
          phone: '444',
          totalDebt: 400,
        },
      ]);

      await Customer.create([
        {
          name: 'Cliente 1',
          email: 'c1@email.com',
          phone: '111',
          address: 'Endereço Cliente 1',
          credit: 100,
          debt: 50,
        },
        {
          name: 'Cliente 2',
          email: 'c2@email.com',
          phone: '222',
          address: 'Endereço Cliente 2',
          credit: 200,
          debt: 150,
          affiliation: affiliation[0]._id,
        },
      ]);

      const res = await request(app)
        .get('/dashboard')
        .set('Authorization', validToken);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('topCustomers');
      expect(res.body.topCustomers.length).toBe(2);
      expect(res.body).toHaveProperty('topAffiliations');
      expect(res.body.topAffiliations.length).toBe(2);
      expect(res.body).toHaveProperty('totalCustomers', 2);
      expect(res.body).toHaveProperty('totalPayments', 0);
      expect(res.body).toHaveProperty('totalSales', 0);
    });
  });
});

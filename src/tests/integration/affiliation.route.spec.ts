import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '~/app';
import { Affiliation } from '~/models/Affiliation';
import { Customer } from '~/models/Customer';
import { generateTestJWT } from '~/helpers/jwt';
import { createdBy } from '../__mocks__/firebase';

jest.setTimeout(60000);

let mongoServer: MongoMemoryServer;

const token = generateTestJWT();

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: '6.0.6' },
      instance: { port: 0 },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
  } catch (err) {
    console.error(
      'Erro ao iniciar MongoMemoryServer ou conectar Mongoose:',
      err
    );
    throw err;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (mongoose.connection) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

const mockAffiliations = [
  {
    name: 'Afiliação 1',
    address: 'Rua 1',
    phone: '111',
    createdBy,
  },
  {
    name: 'Afiliação 2',
    address: 'Rua 2',
    phone: '222',
    createdBy,
  },
];

describe('Affiliations Routes', () => {
  describe('GET /affiliations', () => {
    it('deve retornar lista vazia se não houver afiliações', async () => {
      const res = await request(app)
        .get('/affiliations')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('deve retornar lista de afiliações com totalDebt 0 se não houver clientes', async () => {
      const [aff] = await Affiliation.create([mockAffiliations[0]]);
      const res = await request(app)
        .get('/affiliations')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        name: aff.name,
        address: aff.address,
        phone: aff.phone,
        totalDebt: 0,
      });
    });

    it('deve retornar [] se Affiliation.find() retornar undefined', async () => {
      const originalFind = Affiliation.find;
      Affiliation.find = () => undefined as any;

      const res = await request(app)
        .get('/affiliations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);

      Affiliation.find = originalFind;
    });

    it('deve retornar totalDebt 0 se Customer.find() retornar undefined', async () => {
      const [aff] = await Affiliation.create([mockAffiliations[0]]);

      const originalFind = Customer.find;
      Customer.find = () => undefined as any;

      const res = await request(app)
        .get('/affiliations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        name: aff.name,
        address: aff.address,
        phone: aff.phone,
        totalDebt: 0,
      });

      Customer.find = originalFind;
    });

    it('deve retornar totalDebt 0 se algum cliente não tiver campo debt', async () => {
      const [aff] = await Affiliation.create([mockAffiliations[0]]);
      await Customer.create([
        {
          name: 'SemDebt',
          phone: '000',
          address: 'Rua X',
          affiliation: aff._id,
          createdBy,
        },
      ]);
      const res = await request(app)
        .get('/affiliations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body[0].totalDebt).toBe(0);
    });
  });

  describe('POST /affiliations', () => {
    it('deve criar uma nova afiliação com sucesso', async () => {
      const payload = { name: 'Nova', address: 'Rua Nova', phone: '999' };
      const res = await request(app)
        .post('/affiliations')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(payload);
      expect(res.body).toHaveProperty('_id');
    });

    it('deve retornar mensagem de erro se dados obrigatórios estiverem ausentes', async () => {
      const res = await request(app)
        .post('/affiliations')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Faltando' });

      expect(res.body.message).toBe('"address" is required');
    });
  });

  describe('PUT /affiliations/:id', () => {
    it('deve atualizar uma afiliação com sucesso', async () => {
      const aff = await Affiliation.create({
        name: 'A',
        address: 'B',
        phone: 'C',
        createdBy,
      });
      const payload = {
        name: 'Atualizada',
        address: 'Rua Atualizada',
        phone: '888',
      };

      const res = await request(app)
        .put(`/affiliations/${aff._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(payload);
    });

    it('deve retornar 404 se a afiliação não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/affiliations/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Qualquer', address: 'Rua', phone: '000' });

      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se o id for inválido', async () => {
      const res = await request(app)
        .put('/affiliations/id-invalido')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Qualquer', address: 'Rua', phone: '000' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Formato de ID inválido');
    });

    it('deve retornar 404 se a afiliação não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/affiliations/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Qualquer', address: 'Rua', phone: '000' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Afiliação não encontrada');
    });
  });

  describe('DELETE /affiliations/:id', () => {
    it('deve deletar uma afiliação com sucesso', async () => {
      const aff = await Affiliation.create({
        name: 'A',
        address: 'B',
        phone: 'C',
        createdBy,
      });

      const res = await request(app)
        .delete(`/affiliations/${aff._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it('deve retornar 404 se a afiliação não existir', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/affiliations/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se o id for inválido', async () => {
      const res = await request(app)
        .delete('/affiliations/id-invalido')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });
});

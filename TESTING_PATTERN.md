# Padrão de Testes de Integração - SwiftSale BFF

## 1. Estrutura Geral

- **Todos os testes devem ser de integração**, sem uso de mocks para banco ou models.
- **Utilize `mongodb-memory-server`** para isolar o banco de dados em memória durante os testes.
- **Sempre limpe o banco entre os testes** usando `beforeEach` para garantir independência dos cenários.
- **Use tokens válidos ou utilitários para geração de JWT** para autenticação em rotas protegidas.
- **Cubra todos os fluxos**: sucesso, erro, dados inválidos, listas vazias, branches de erro, etc.
- **Organize os testes em blocos `describe`** por rota ou grupo de endpoints, e `it` por cenário.
- **Valide status HTTP e corpo da resposta** em todos os testes.
- **Evite qualquer tipo de mock de models, controllers ou services**.

---

## 2. Setup Padrão para Integração

```typescript
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '~/app';

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
```

---

## 3. Exemplo de Teste de Integração para Rotas

```typescript
describe('Affiliations API', () => {
  it('deve retornar lista vazia se não houver afiliações', async () => {
    const res = await request(app)
      .get('/affiliations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve criar uma nova afiliação com sucesso', async () => {
    const payload = { name: 'Nova', address: 'Rua 1', phone: '123' };
    const res = await request(app)
      .post('/affiliations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body).toHaveProperty('_id');
  });

  it('deve retornar erro se dados obrigatórios estiverem ausentes', async () => {
    const res = await request(app)
      .post('/affiliations')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mensagem de erro esperada');
  });

  it('deve retornar 404 se recurso não existir', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/affiliations/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Qualquer' });
    expect(res.status).toBe(404);
  });

  it('deve retornar 400 se o id for inválido', async () => {
    const res = await request(app)
      .put('/affiliations/id-invalido')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Qualquer' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Formato de ID inválido/);
  });
});
```

---

## 4. Boas Práticas

- Use nomes descritivos para os testes.
- Sempre cubra todos os fluxos possíveis (sucesso, erro, dados inválidos, listas vazias, branches de erro).
- Nunca utilize mocks para models, controllers ou services.
- Sempre limpe o banco entre os testes.
- Utilize tokens válidos ou utilitários para geração de JWT.
- Valide status HTTP e corpo da resposta.

---

## 5. Observação

Este padrão deve ser seguido para todos os testes de integração de services, controllers, rotas e utils do projeto SwiftSale BFF.

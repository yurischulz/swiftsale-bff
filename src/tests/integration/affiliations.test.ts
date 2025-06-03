import request from 'supertest';
import express from 'express';
import affiliationsRouter from '~/routes/affiliations.routes';

const mockAuth = jest.fn((req, res, next) => next());
jest.mock('../../middlewares/auth', () => ({
  authenticateToken: (...args: any[]) => mockAuth(...args),
}));

const mockGetAll = jest.fn((req, res) =>
  res.status(200).json([{ _id: 'a1', name: 'Aff 1' }])
);
const mockCreate = jest.fn((req, res) =>
  res.status(201).json({ _id: 'a2', name: req.body.name })
);
const mockUpdate = jest.fn((req, res) =>
  res.status(200).json({ _id: req.params.id, name: req.body.name })
);
const mockDelete = jest.fn((req, res) => res.status(204).send());

jest.mock('../../controllers/affiliation.controller', () => ({
  getAllAffiliations: (...args: any[]) => mockGetAll(...args),
  createAffiliation: (...args: any[]) => mockCreate(...args),
  updateAffiliation: (...args: any[]) => mockUpdate(...args),
  deleteAffiliation: (...args: any[]) => mockDelete(...args),
}));

const app = express();
app.use(express.json());
app.use('/affiliations', affiliationsRouter);

describe('Affiliations Integration Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /affiliations retorna todas as affiliations', async () => {
    const res = await request(app).get('/affiliations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'a1', name: 'Aff 1' }]);
    expect(mockAuth).toHaveBeenCalled();
    expect(mockGetAll).toHaveBeenCalled();
  });

  it('POST /affiliations cria uma affiliation', async () => {
    const res = await request(app)
      .post('/affiliations')
      .send({ name: 'Nova Aff' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ _id: 'a2', name: 'Nova Aff' });
    expect(mockAuth).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
  });

  it('PUT /affiliations/:id atualiza uma affiliation', async () => {
    const res = await request(app)
      .put('/affiliations/abc123')
      .send({ name: 'Atualizada' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ _id: 'abc123', name: 'Atualizada' });
    expect(mockAuth).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('DELETE /affiliations/:id deleta uma affiliation', async () => {
    const res = await request(app).delete('/affiliations/abc123');
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(mockAuth).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalled();
  });

  it('deve passar corretamente os parâmetros para update e delete', async () => {
    await request(app).put('/affiliations/xyz789').send({ name: 'Test' });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { id: 'xyz789' },
        body: { name: 'Test' },
      }),
      expect.any(Object)
    );
    await request(app).delete('/affiliations/xyz789');
    expect(mockDelete).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: 'xyz789' } }),
      expect.any(Object)
    );
  });

  it('deve retornar erro se controller lançar erro', async () => {
    mockGetAll.mockImplementationOnce((req, res) =>
      res.status(500).json({ error: 'fail' })
    );
    const res = await request(app).get('/affiliations');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'fail' });
  });
});

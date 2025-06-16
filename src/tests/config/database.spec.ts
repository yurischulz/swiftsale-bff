import mongoose from 'mongoose';
import { connectDatabase } from '~/config/database';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDatabase', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MONGO_URI: 'mongodb://localhost:27017/testdb',
    };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('deve conectar ao MongoDB com sucesso', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/testdb',
      {}
    );
    expect(logSpy).toHaveBeenCalledWith('✅ MongoDB connected');
    logSpy.mockRestore();
  });

  it('deve exibir erro e encerrar o processo em caso de falha', async () => {
    const error = new Error('Falha na conexão');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation() as unknown as jest.Mock;

    await connectDatabase();

    expect(errorSpy).toHaveBeenCalledWith(
      '❌ MongoDB connection failed',
      error
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

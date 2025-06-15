import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(120000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: '6.0.6' },
  });
  const uri = mongoServer.getUri();
  console.log('MongoDB URI:', uri);
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test('mongo memory server funciona', async () => {
  console.log('mongoose.connection:', mongoose.connection);
  expect(mongoose.connection.readyState).toBe(1);
});

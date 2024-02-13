import request from 'supertest';
import app from '../../src';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

console.log(process.env.NODE_ENV);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.close();
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth Controller Register', () => {
  it('sucesfully register a new user', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    const response = await request(app).post('/api/auth/register').send(newUser);

    expect(response.status).toBe(201);

    expect(response.body.message).toBe('User registered sucesfully');
  });
});

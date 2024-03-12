import request from 'supertest';
import app from '../../index';

describe('User routes', () => {
  it('Should register a user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'testuser',
      lastName: 'usertest',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});

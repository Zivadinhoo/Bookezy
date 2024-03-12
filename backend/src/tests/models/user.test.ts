import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { isValidationError, isMongoError } from '../../validators/validationError';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model Test', () => {
  it('create & save user successfully', async () => {
    const userData = { email: 'test@example.com', password: '123456', firstName: 'Test', lastName: 'User' };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).not.toBe(userData.password); // Password bi trebao biti hashed
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
  });

  it('hashes the password before saving the user', async () => {
    const user = new User({ email: 'hash@example.com', password: 'password', firstName: 'Hash', lastName: 'Test' });
    const savedUser = await user.save();

    expect(savedUser.password).not.toBe('password');
    const match = await bcrypt.compare('password', savedUser.password);
    expect(match).toBe(true);
  });

  it('requires email field', async () => {
    const userWithoutEmail = new User({ password: '123456', firstName: 'Test', lastName: 'User' });
    let err: unknown;
    try {
      await userWithoutEmail.save();
    } catch (error) {
      err = error;
    }

    if (isValidationError(err)) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.email).toBeDefined();
    } else {
      throw new Error('Unexpected error type');
    }
  });

  it('enforces email uniqueness', async () => {
    await User.create({ email: 'unique@example.com', password: '123456', firstName: 'User', lastName: 'Test' });

    const duplicateEmailUser = new User({
      email: 'unique@example.com',
      password: '654321',
      firstName: 'Duplicate',
      lastName: 'User',
    });

    let err: unknown;

    try {
      await duplicateEmailUser.save();
    } catch (error) {
      err = error;
    }

    if (isMongoError(err)) {
      expect(err.code).toBe(11000);
    } else {
      throw new Error('Unexpected error type');
    }
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<any>;
  let jwtToken: string;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = await connect(uri);

    // Define user schema for the test
    const userSchema = new Schema({
      username: String,
      password: String,
      roles: [String],
    });
    userModel = model('User', userSchema);

    // Create test users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userModel.create({
      username: 'admin',
      password: hashedPassword,
      roles: ['admin'],
    });

    // Set environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRATION_TIME = '1h';
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.MONGODB_URI = uri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(userModel)
      .compile();

    app = moduleFixture.createNestApplication();

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);
    });

    it('should return JWT token for valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.username).toEqual('admin');
          jwtToken = res.body.access_token;
        });
    });
  });

  describe('/users/profile (GET)', () => {
    it('should return 401 for requests without token', () => {
      return request(app.getHttpServer()).get('/users/profile').expect(401);
    });

    it('should return profile for authenticated requests', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toEqual('This is a protected route');
        });
    });
  });
});

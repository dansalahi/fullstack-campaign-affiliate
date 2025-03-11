import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: mongoose.Connection;
  let userModel: mongoose.Model<any>;
  let jwtToken: string;

  beforeAll(async () => {
    // Set environment variables first
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRATION_TIME = '1h';
    process.env.SESSION_SECRET = 'test-session-secret';

    // Set up MongoDB Memory Server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;

    // Connect to the in-memory database
    await mongoose.connect(uri);
    mongoConnection = mongoose.connection;

    // Define user schema for the test
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      roles: [String],
    });

    // Create the model
    userModel = mongoose.model('User', userSchema);

    // Create test users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userModel.create({
      username: 'admin',
      password: hashedPassword,
      roles: ['admin'],
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Load environment variables explicitly for testing
          load: [
            () => ({
              JWT_SECRET: process.env.JWT_SECRET,
              JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
              MONGODB_URI: process.env.MONGODB_URI,
              SESSION_SECRET: process.env.SESSION_SECRET,
            }),
          ],
        }),
        AppModule,
      ],
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

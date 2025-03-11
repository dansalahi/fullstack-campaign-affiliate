import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Influencer } from '../src/influencers/schemas/influencer.schema';
import { User } from '../src/users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as bcrypt from 'bcrypt';

describe('Influencers (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: mongoose.Connection;
  let influencerModel: mongoose.Model<any>;
  let userModel: mongoose.Model<any>;
  let jwtService: JwtService;
  let accessToken: string;
  let influencerId: string;

  const mockInfluencer = {
    name: 'Test Influencer',
    country: 'Test Country',
    followers: 100000,
    status: 'verified',
    baseCost: 50000,
    avatar: 'test.jpg',
  };

  beforeAll(async () => {
    // Set environment variables
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRATION_TIME = '1h';

    // Set up MongoDB Memory Server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGODB_URI = uri;

    // Connect to the in-memory database
    await mongoose.connect(uri);
    mongoConnection = mongoose.connection;

    // Define schemas for the test
    const influencerSchema = new mongoose.Schema(
      {
        name: String,
        country: String,
        followers: Number,
        status: String,
        baseCost: Number,
        avatar: String,
        createdAt: Date,
        updatedAt: Date,
      },
      { timestamps: true },
    );

    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      roles: [String],
    });

    // Create the models
    influencerModel = mongoose.model('Influencer', influencerSchema);
    userModel = mongoose.model('User', userSchema);

    // Clear any existing data
    await influencerModel.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userModel.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roles: ['admin'],
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(Influencer.name))
      .useValue(influencerModel)
      .overrideProvider(getModelToken(User.name))
      .useValue(userModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();

    // Generate JWT token for authentication
    accessToken = jwtService.sign({
      sub: 'test-user-id',
      username: 'admin',
      roles: ['admin'],
    });
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongod.stop();
    await app.close();
  });

  it('should create an influencer (POST /influencers)', async () => {
    const response = await request(app.getHttpServer())
      .post('/influencers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockInfluencer)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toEqual(mockInfluencer.name);
    expect(response.body.country).toEqual(mockInfluencer.country);
    expect(response.body.followers).toEqual(mockInfluencer.followers);
    expect(response.body.status).toEqual(mockInfluencer.status);
    expect(response.body.baseCost).toEqual(mockInfluencer.baseCost);
    expect(response.body.avatar).toEqual(mockInfluencer.avatar);

    influencerId = response.body._id;
  });

  it('should get all influencers (GET /influencers)', async () => {
    const response = await request(app.getHttpServer())
      .get('/influencers')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('_id');

    // Find the influencer we created in the previous test
    const createdInfluencer = response.body.find(
      (influencer) => influencer._id === influencerId,
    );
    expect(createdInfluencer).toBeDefined();
    expect(createdInfluencer.name).toEqual(mockInfluencer.name);
  });

  it('should get a single influencer (GET /influencers/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/influencers/${influencerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toEqual(influencerId);
    expect(response.body.name).toEqual(mockInfluencer.name);
  });

  it('should update an influencer (PATCH /influencers/:id)', async () => {
    const updateData = {
      name: 'Updated Influencer',
      followers: 200000,
    };

    const response = await request(app.getHttpServer())
      .patch(`/influencers/${influencerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toEqual(influencerId);
    expect(response.body.name).toEqual(updateData.name);
    expect(response.body.followers).toEqual(updateData.followers);
    expect(response.body.country).toEqual(mockInfluencer.country); // Unchanged field
  });

  it('should return 404 for non-existent influencer (GET /influencers/:id)', async () => {
    // Use a valid ObjectId format but one that doesn't exist in the database
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    await request(app.getHttpServer())
      .get(`/influencers/${nonExistentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should delete an influencer (DELETE /influencers/:id)', async () => {
    await request(app.getHttpServer())
      .delete(`/influencers/${influencerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Verify the influencer was deleted
    await request(app.getHttpServer())
      .get(`/influencers/${influencerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should require authentication for protected routes', async () => {
    await request(app.getHttpServer()).get('/influencers').expect(401);
  });
});

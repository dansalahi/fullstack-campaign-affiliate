import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { Campaign } from '../src/campaigns/schemas/campaign.schema';
import { User } from '../src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('CampaignsController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: mongoose.Connection;
  let campaignModel: mongoose.Model<any>;
  let userModel: mongoose.Model<any>;
  let jwtToken: string;
  let createdCampaignId: string;
  let jwtService: JwtService;

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
    const campaignSchema = new mongoose.Schema(
      {
        name: String,
        type: String,
        brandUrl: String,
        countries: [String],
        startDate: Date,
        endDate: Date,
        discountValue: Number,
        couponsAvailable: Number,
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
    campaignModel = mongoose.model('Campaign', campaignSchema);
    userModel = mongoose.model('User', userSchema);

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
      .overrideProvider(getModelToken(Campaign.name))
      .useValue(campaignModel)
      .overrideProvider(getModelToken(User.name))
      .useValue(userModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();

    // Generate JWT token for authentication
    jwtToken = jwtService.sign({
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

  it('/campaigns (POST) - should create a new campaign', () => {
    const createCampaignDto = {
      name: 'Test Campaign',
      type: 'Affiliate',
      brandUrl: 'https://www.example.com',
      countries: ['USA', 'Canada'],
      startDate: new Date('2023-01-01').toISOString(),
      endDate: new Date('2023-12-31').toISOString(),
      discountValue: 10,
      couponsAvailable: 100,
    };

    return request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createCampaignDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual(createCampaignDto.name);
        expect(res.body._id).toBeDefined();
        createdCampaignId = res.body._id;
      });
  });

  it('/campaigns (GET) - should return all campaigns', () => {
    return request(app.getHttpServer())
      .get('/campaigns')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/campaigns/:id (GET) - should return a campaign by id', () => {
    return request(app.getHttpServer())
      .get(`/campaigns/${createdCampaignId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdCampaignId);
      });
  });

  it('/campaigns/:id (PATCH) - should update a campaign', () => {
    const updateCampaignDto = {
      name: 'Updated Test Campaign',
    };

    return request(app.getHttpServer())
      .patch(`/campaigns/${createdCampaignId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateCampaignDto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual(updateCampaignDto.name);
        expect(res.body._id).toEqual(createdCampaignId);
      });
  });

  it('/campaigns/:id (DELETE) - should delete a campaign', () => {
    return request(app.getHttpServer())
      .delete(`/campaigns/${createdCampaignId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdCampaignId);
      });
  });

  it('/campaigns/:id (GET) - should return 404 for deleted campaign', () => {
    return request(app.getHttpServer())
      .get(`/campaigns/${createdCampaignId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });
});

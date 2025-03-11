import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { DatabaseTestModule } from '../../database/database-test.module';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseTestModule],
      providers: [
        JwtStrategy,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await DatabaseTestModule.closeDatabase();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user payload', async () => {
      const payload = {
        sub: 'some-id',
        username: 'testuser',
        roles: ['user'],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'some-id',
        username: 'testuser',
        roles: ['user'],
      });
    });
  });
});

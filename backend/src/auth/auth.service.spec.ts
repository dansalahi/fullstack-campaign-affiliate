import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { DatabaseTestModule } from '../database/database-test.module';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    new: jest.fn().mockResolvedValue({
      save: jest.fn().mockResolvedValue({
        _id: 'some-id',
        username: 'admin',
        roles: ['admin'],
        toObject: () => ({
          _id: 'some-id',
          username: 'admin',
          roles: ['admin'],
          password: 'hashed-password',
        }),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseTestModule],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Mock the findByUsername method
    jest
      .spyOn(usersService, 'findByUsername')
      .mockImplementation(async (username) => {
        if (username === 'admin') {
          return {
            _id: 'some-id',
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            roles: ['admin'],
            toObject: () => ({
              _id: 'some-id',
              username: 'admin',
              roles: ['admin'],
              password: 'hashed-password',
            }),
          } as any;
        }
        return null;
      });

    // Mock the validatePassword method
    jest
      .spyOn(usersService, 'validatePassword')
      .mockImplementation(async (user, password) => {
        return password === 'admin123';
      });
  });

  afterAll(async () => {
    await DatabaseTestModule.closeDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const result = await service.validateUser('admin', 'admin123');
      expect(result).toEqual({
        _id: 'some-id',
        username: 'admin',
        roles: ['admin'],
      });
    });

    it('should return null when credentials are invalid', async () => {
      const result = await service.validateUser('admin', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      const result = await service.validateUser('nonexistent', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user info when credentials are valid', async () => {
      const result = await service.login('admin', 'admin123');
      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: 'some-id',
          username: 'admin',
          roles: ['admin'],
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'some-id',
        username: 'admin',
        roles: ['admin'],
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

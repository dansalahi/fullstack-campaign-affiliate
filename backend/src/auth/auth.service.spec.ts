import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  // Create a mock for UsersService
  const mockUsersService = {
    findByUsername: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      // Mock the user object
      const mockUser = {
        _id: 'some-id',
        username: 'admin',
        password: 'hashed-password',
        roles: ['admin'],
        toObject: () => ({
          _id: 'some-id',
          username: 'admin',
          roles: ['admin'],
          password: 'hashed-password',
        }),
      };

      // Setup the mocks
      mockUsersService.findByUsername.mockResolvedValueOnce(mockUser);
      mockUsersService.validatePassword.mockResolvedValueOnce(true);

      const result = await service.validateUser('admin', 'admin123');

      expect(result).toEqual({
        _id: 'some-id',
        username: 'admin',
        roles: ['admin'],
      });

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('admin');
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        mockUser,
        'admin123',
      );
    });

    it('should return null when credentials are invalid', async () => {
      // Mock the user object
      const mockUser = {
        _id: 'some-id',
        username: 'admin',
        password: 'hashed-password',
        roles: ['admin'],
      };

      // Setup the mocks
      mockUsersService.findByUsername.mockResolvedValueOnce(mockUser);
      mockUsersService.validatePassword.mockResolvedValueOnce(false);

      const result = await service.validateUser('admin', 'wrongpassword');

      expect(result).toBeNull();

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('admin');
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        mockUser,
        'wrongpassword',
      );
    });

    it('should return null when user does not exist', async () => {
      // Setup the mocks
      mockUsersService.findByUsername.mockResolvedValueOnce(null);

      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(
        'nonexistent',
      );
      expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token and user info when credentials are valid', async () => {
      // Mock the validateUser method
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce({
        _id: 'some-id',
        username: 'admin',
        roles: ['admin'],
      });

      const result = await service.login('admin', 'admin123');

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: 'some-id',
          username: 'admin',
          roles: ['admin'],
        },
      });

      expect(service.validateUser).toHaveBeenCalledWith('admin', 'admin123');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'some-id',
        username: 'admin',
        roles: ['admin'],
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Mock the validateUser method
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(null);

      await expect(service.login('admin', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(service.validateUser).toHaveBeenCalledWith(
        'admin',
        'wrongpassword',
      );
    });
  });
});

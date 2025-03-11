import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { DatabaseTestModule } from '../database/database-test.module';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockImplementation((username, password) => {
      return {
        access_token: 'test-token',
        user: {
          id: 'some-id',
          username,
          roles: ['admin'],
        },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseTestModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await DatabaseTestModule.closeDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token and user info', async () => {
      const loginDto: LoginDto = {
        username: 'admin',
        password: 'admin123',
      };

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: 'some-id',
          username: 'admin',
          roles: ['admin'],
        },
      });

      expect(authService.login).toHaveBeenCalledWith('admin', 'admin123');
    });
  });
});

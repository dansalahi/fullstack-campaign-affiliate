import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    new: jest.fn().mockResolvedValue({
      save: jest.fn(),
    }),
  };

  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a protected message', () => {
      expect(controller.getProfile()).toEqual({
        message: 'This is a protected route',
      });
    });
  });
});

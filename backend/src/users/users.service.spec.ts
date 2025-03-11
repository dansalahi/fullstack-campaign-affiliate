import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    new: jest.fn().mockResolvedValue({
      save: jest.fn().mockResolvedValue({
        _id: 'some-id',
        username: 'testuser',
        roles: ['user'],
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return a user if found', async () => {
      const user = {
        _id: 'some-id',
        username: 'testuser',
        password: 'hashedpassword',
        roles: ['user'],
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(user),
      });

      const result = await service.findByUsername('testuser');
      expect(result).toEqual(user);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        username: 'testuser',
      });
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await service.findByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });
});

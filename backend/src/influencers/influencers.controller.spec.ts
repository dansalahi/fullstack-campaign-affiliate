import { Test, TestingModule } from '@nestjs/testing';
import { InfluencersController } from './influencers.controller';
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { NotFoundException } from '@nestjs/common';

describe('InfluencersController', () => {
  let controller: InfluencersController;
  let service: InfluencersService;

  const mockInfluencer = {
    _id: 'a-mock-id',
    name: 'Michael Ryhe',
    country: 'France',
    followers: 1000000,
    status: 'verified',
    baseCost: 200000,
    avatar: '1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInfluencersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfluencersController],
      providers: [
        {
          provide: InfluencersService,
          useValue: mockInfluencersService,
        },
      ],
    }).compile();

    controller = module.get<InfluencersController>(InfluencersController);
    service = module.get<InfluencersService>(InfluencersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new influencer', async () => {
      const createInfluencerDto: CreateInfluencerDto = {
        name: 'New Influencer',
        country: 'USA',
        followers: 500000,
        status: 'verified',
        baseCost: 100000,
        avatar: 'new.jpg',
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        ...createInfluencerDto,
        _id: 'a-mock-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await controller.create(createInfluencerDto);
      expect(result).toHaveProperty('_id');
      expect(service.create).toHaveBeenCalledWith(createInfluencerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of influencers', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockInfluencer] as any);

      const result = await controller.findAll();
      expect(result).toEqual([mockInfluencer]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single influencer', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockInfluencer as any);

      const result = await controller.findOne('a-mock-id');
      expect(result).toEqual(mockInfluencer);
      expect(service.findOne).toHaveBeenCalledWith('a-mock-id');
    });

    it('should throw NotFoundException if influencer is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an influencer', async () => {
      const updateInfluencerDto: UpdateInfluencerDto = {
        name: 'Updated Influencer',
      };
      const updatedInfluencer = {
        ...mockInfluencer,
        name: 'Updated Influencer',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedInfluencer as any);

      const result = await controller.update('a-mock-id', updateInfluencerDto);
      expect(result).toEqual(updatedInfluencer);
      expect(service.update).toHaveBeenCalledWith(
        'a-mock-id',
        updateInfluencerDto,
      );
    });

    it('should throw NotFoundException if influencer to update is not found', async () => {
      const updateInfluencerDto: UpdateInfluencerDto = {
        name: 'Updated Influencer',
      };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('nonexistent-id', updateInfluencerDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an influencer', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockInfluencer as any);

      const result = await controller.remove('a-mock-id');
      expect(result).toEqual(mockInfluencer);
      expect(service.remove).toHaveBeenCalledWith('a-mock-id');
    });

    it('should throw NotFoundException if influencer to remove is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

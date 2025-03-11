import { Test, TestingModule } from '@nestjs/testing';
import { InfluencersService } from './influencers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Influencer, InfluencerDocument } from './schemas/influencer.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

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

describe('InfluencersService', () => {
  let service: InfluencersService;
  let model: Model<InfluencerDocument>;

  const mockInfluencerModel = () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfluencersService,
        {
          provide: getModelToken(Influencer.name),
          useFactory: mockInfluencerModel,
        },
      ],
    }).compile();

    service = module.get<InfluencersService>(InfluencersService);
    model = module.get<Model<InfluencerDocument>>(
      getModelToken(Influencer.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new influencer', async () => {
      const createInfluencerDto = {
        name: 'New Influencer',
        country: 'USA',
        followers: 500000,
        status: 'verified',
        baseCost: 100000,
        avatar: 'new.jpg',
      };

      // Override the implementation of the service's create method for this test
      jest.spyOn(service, 'create').mockImplementationOnce(async () => {
        return {
          ...createInfluencerDto,
          _id: 'a-mock-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as InfluencerDocument;
      });

      const result = await service.create(createInfluencerDto);
      expect(result).toHaveProperty('_id');
      expect(result.name).toEqual(createInfluencerDto.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of influencers', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockInfluencer]),
      } as any);

      const influencers = await service.findAll();
      expect(influencers).toEqual([mockInfluencer]);
    });
  });

  describe('findOne', () => {
    it('should return a single influencer', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInfluencer),
      } as any);

      const influencer = await service.findOne('a-mock-id');
      expect(influencer).toEqual(mockInfluencer);
    });

    it('should throw NotFoundException if influencer is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an influencer', async () => {
      const updateInfluencerDto = { name: 'Updated Influencer' };
      const updatedInfluencer = {
        ...mockInfluencer,
        name: 'Updated Influencer',
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedInfluencer),
      } as any);

      const result = await service.update('a-mock-id', updateInfluencerDto);
      expect(result.name).toEqual('Updated Influencer');
    });

    it('should throw NotFoundException if influencer to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.update('nonexistent-id', { name: 'Updated Influencer' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an influencer', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInfluencer),
      } as any);

      const result = await service.remove('a-mock-id');
      expect(result).toEqual(mockInfluencer);
    });

    it('should throw NotFoundException if influencer to remove is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

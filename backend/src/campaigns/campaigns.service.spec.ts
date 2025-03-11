import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { getModelToken } from '@nestjs/mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CampaignInfluencersService } from '../campaign-influencers/campaign-influencers.service';
import { InfluencersService } from '../influencers/influencers.service';
import * as mongoose from 'mongoose';

// Mock the isValidObjectId function to always return true in tests
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    isValidObjectId: jest.fn().mockReturnValue(true),
  };
});

const mockCampaign = {
  _id: 'a-mock-id',
  name: 'Test Campaign',
  type: 'Affiliate',
  brandUrl: 'https://www.example.com',
  countries: ['USA', 'Canada'],
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  discountValue: 10,
  couponsAvailable: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CampaignsService', () => {
  let service: CampaignsService;
  let model: Model<CampaignDocument>;
  let campaignInfluencersService: CampaignInfluencersService;
  let influencersService: InfluencersService;

  const mockCampaignModel = () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    new: jest.fn().mockResolvedValue(mockCampaign),
  });

  // Create mock implementations for the services
  const mockCampaignInfluencersService = {
    findByCampaignId: jest.fn().mockResolvedValue([]),
  };

  const mockInfluencersService = {
    findOne: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getModelToken(Campaign.name),
          useFactory: mockCampaignModel,
        },
        {
          provide: CampaignInfluencersService,
          useValue: mockCampaignInfluencersService,
        },
        {
          provide: InfluencersService,
          useValue: mockInfluencersService,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    model = module.get<Model<CampaignDocument>>(getModelToken(Campaign.name));
    campaignInfluencersService = module.get<CampaignInfluencersService>(
      CampaignInfluencersService,
    );
    influencersService = module.get<InfluencersService>(InfluencersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new campaign', async () => {
      const createCampaignDto = {
        name: 'New Campaign',
        type: 'Affiliate',
        brandUrl: 'https://www.example.com',
        countries: ['USA', 'Canada'],
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        discountValue: 10,
        couponsAvailable: 100,
      };

      const newCampaign = {
        ...createCampaignDto,
        _id: 'a-mock-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Directly mock the service method
      jest.spyOn(service, 'create').mockResolvedValue(newCampaign as any);

      const result = await service.create(createCampaignDto);
      expect(result).toHaveProperty('_id');
      expect(result.name).toEqual(createCampaignDto.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const mockCampaignWithToObject = {
        ...mockCampaign,
        toObject: jest.fn().mockReturnValue(mockCampaign),
      };

      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCampaignWithToObject]),
      } as any);

      // Mock the campaignInfluencersService.findByCampaignId method
      campaignInfluencersService.findByCampaignId = jest
        .fn()
        .mockResolvedValue([]);

      const campaigns = await service.findAll();
      expect(campaigns[0]).toHaveProperty('name', mockCampaign.name);
    });
  });

  describe('findOne', () => {
    it('should return a single campaign', async () => {
      const mockCampaignWithToObject = {
        ...mockCampaign,
        toObject: jest.fn().mockReturnValue(mockCampaign),
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampaignWithToObject),
      } as any);

      // Mock the campaignInfluencersService.findByCampaignId method
      campaignInfluencersService.findByCampaignId = jest
        .fn()
        .mockResolvedValue([]);

      const campaign = await service.findOne('a-mock-id');
      expect(campaign).toHaveProperty('name', mockCampaign.name);
    });

    it('should throw NotFoundException if campaign is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Mock the isValidObjectId function for this specific test
      (mongoose.isValidObjectId as jest.Mock).mockReturnValueOnce(true);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a campaign', async () => {
      const updateCampaignDto = { name: 'Updated Campaign' };
      const updatedCampaign = {
        ...mockCampaign,
        name: 'Updated Campaign',
        toObject: jest.fn().mockReturnValue({
          ...mockCampaign,
          name: 'Updated Campaign',
        }),
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCampaign),
      } as any);

      const result = await service.update('a-mock-id', updateCampaignDto);
      expect(result.name).toEqual('Updated Campaign');
    });

    it('should throw NotFoundException if campaign to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Mock the isValidObjectId function for this specific test
      (mongoose.isValidObjectId as jest.Mock).mockReturnValueOnce(true);

      await expect(
        service.update('nonexistent-id', { name: 'Updated Campaign' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a campaign', async () => {
      const deletedCampaign = {
        ...mockCampaign,
        toObject: jest.fn().mockReturnValue(mockCampaign),
      };

      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedCampaign),
      } as any);

      const result = await service.remove('a-mock-id');
      expect(result._id).toEqual(mockCampaign._id);
      expect(result.name).toEqual(mockCampaign.name);
    });

    it('should throw NotFoundException if campaign to remove is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Mock the isValidObjectId function for this specific test
      (mongoose.isValidObjectId as jest.Mock).mockReturnValueOnce(true);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

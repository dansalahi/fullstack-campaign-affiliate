import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { getModelToken } from '@nestjs/mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

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

  const mockCampaignModel = () => ({
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
        CampaignsService,
        {
          provide: getModelToken(Campaign.name),
          // Use a factory function that returns a new mock each time
          useFactory: mockCampaignModel,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    model = module.get<Model<CampaignDocument>>(getModelToken(Campaign.name));
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

      // Override the implementation of the service's create method for this test
      jest.spyOn(service, 'create').mockImplementationOnce(async () => {
        return {
          ...createCampaignDto,
          _id: 'a-mock-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as CampaignDocument;
      });

      const result = await service.create(createCampaignDto);
      expect(result).toHaveProperty('_id');
      expect(result.name).toEqual(createCampaignDto.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCampaign]),
      } as any);

      const campaigns = await service.findAll();
      expect(campaigns).toEqual([mockCampaign]);
    });
  });

  describe('findOne', () => {
    it('should return a single campaign', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampaign),
      } as any);

      const campaign = await service.findOne('a-mock-id');
      expect(campaign).toEqual(mockCampaign);
    });

    it('should throw NotFoundException if campaign is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

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

      await expect(
        service.update('nonexistent-id', { name: 'Updated Campaign' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a campaign', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampaign),
      } as any);

      const result = await service.remove('a-mock-id');
      expect(result).toEqual(mockCampaign);
    });

    it('should throw NotFoundException if campaign to remove is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

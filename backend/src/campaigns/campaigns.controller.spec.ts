import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

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

describe('CampaignsController', () => {
  let controller: CampaignsController;
  let service: CampaignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCampaign),
            findAll: jest.fn().mockResolvedValue([mockCampaign]),
            findOne: jest.fn().mockResolvedValue(mockCampaign),
            update: jest.fn().mockResolvedValue({
              ...mockCampaign,
              name: 'Updated Campaign',
            }),
            remove: jest.fn().mockResolvedValue(mockCampaign),
          },
        },
      ],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
    service = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a campaign', async () => {
      const createCampaignDto: CreateCampaignDto = {
        name: 'New Campaign',
        type: 'Affiliate',
        brandUrl: 'https://www.example.com',
        countries: ['USA', 'Canada'],
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        discountValue: 10,
        couponsAvailable: 100,
      };

      expect(await controller.create(createCampaignDto)).toEqual(mockCampaign);
      expect(service.create).toHaveBeenCalledWith(createCampaignDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      expect(await controller.findAll()).toEqual([mockCampaign]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single campaign', async () => {
      expect(await controller.findOne('a-mock-id')).toEqual(mockCampaign);
      expect(service.findOne).toHaveBeenCalledWith('a-mock-id');
    });
  });

  describe('update', () => {
    it('should update a campaign', async () => {
      const updateCampaignDto: UpdateCampaignDto = { name: 'Updated Campaign' };

      expect(await controller.update('a-mock-id', updateCampaignDto)).toEqual({
        ...mockCampaign,
        name: 'Updated Campaign',
      });

      expect(service.update).toHaveBeenCalledWith(
        'a-mock-id',
        updateCampaignDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a campaign', async () => {
      expect(await controller.remove('a-mock-id')).toEqual(mockCampaign);
      expect(service.remove).toHaveBeenCalledWith('a-mock-id');
    });
  });
});

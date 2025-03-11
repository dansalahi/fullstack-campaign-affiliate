import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignInfluencersService } from '../campaign-influencers/campaign-influencers.service';
import { InfluencersService } from '../influencers/influencers.service';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private campaignInfluencersService: CampaignInfluencersService,
    private influencersService: InfluencersService,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignDocument> {
    const newCampaign = new this.campaignModel(createCampaignDto);
    return newCampaign.save();
  }

  async findAll(): Promise<any[]> {
    const campaigns = await this.campaignModel.find().exec();

    // Enhance campaigns with influencers
    const enhancedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignInfluencers =
          await this.campaignInfluencersService.findByCampaignId(
            campaign._id.toString(),
          );

        // Get full influencer details for each campaign-influencer relationship
        const influencers = await Promise.all(
          campaignInfluencers.map(async (ci) => {
            try {
              const influencer = await this.influencersService.findOne(
                ci.influencerId.toString(),
              );

              return {
                ...influencer.toObject(),
                campaignInfluencerId: ci._id,
                cost: ci.cost,
                assignedCoupons: ci.assignedCoupons,
                status: ci.status,
              };
            } catch (error) {
              // If influencer not found, return just the campaign-influencer data
              return {
                influencerId: ci.influencerId,
                campaignInfluencerId: ci._id,
                cost: ci.cost,
                assignedCoupons: ci.assignedCoupons,
                status: ci.status,
              };
            }
          }),
        );

        return {
          ...campaign.toObject(),
          influencers,
        };
      }),
    );

    return enhancedCampaigns;
  }

  async findOne(id: string): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid campaign ID format: ${id}`);
    }

    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    // Get campaign-influencer relationships for this campaign
    const campaignInfluencers =
      await this.campaignInfluencersService.findByCampaignId(id);

    // Get full influencer details for each campaign-influencer relationship
    const influencers = await Promise.all(
      campaignInfluencers.map(async (ci) => {
        try {
          const influencer = await this.influencersService.findOne(
            ci.influencerId.toString(),
          );

          return {
            ...influencer.toObject(),
            campaignInfluencerId: ci._id,
            cost: ci.cost,
            assignedCoupons: ci.assignedCoupons,
            status: ci.status,
          };
        } catch (error) {
          // If influencer not found, return just the campaign-influencer data
          return {
            influencerId: ci.influencerId,
            campaignInfluencerId: ci._id,
            cost: ci.cost,
            assignedCoupons: ci.assignedCoupons,
            status: ci.status,
          };
        }
      }),
    );

    return {
      ...campaign.toObject(),
      influencers,
    };
  }

  async update(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<CampaignDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid campaign ID format: ${id}`);
    }

    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();

    if (!updatedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return updatedCampaign;
  }

  async remove(id: string): Promise<CampaignDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid campaign ID format: ${id}`);
    }

    const deletedCampaign = await this.campaignModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return deletedCampaign;
  }
}

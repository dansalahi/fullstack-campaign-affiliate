import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(
    createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignDocument> {
    const newCampaign = new this.campaignModel(createCampaignDto);
    return newCampaign.save();
  }

  async findAll(): Promise<CampaignDocument[]> {
    return this.campaignModel.find().exec();
  }

  async findOne(id: string): Promise<CampaignDocument> {
    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<CampaignDocument> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();

    if (!updatedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return updatedCampaign;
  }

  async remove(id: string): Promise<CampaignDocument> {
    const deletedCampaign = await this.campaignModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return deletedCampaign;
  }
}

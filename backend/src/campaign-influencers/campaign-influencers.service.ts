import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  CampaignInfluencer,
  CampaignInfluencerDocument,
} from './schemas/campaign-influencer.schema';
import { CreateCampaignInfluencerDto } from './dto/create-campaign-influencer.dto';
import { UpdateCampaignInfluencerDto } from './dto/update-campaign-influencer.dto';

@Injectable()
export class CampaignInfluencersService {
  constructor(
    @InjectModel(CampaignInfluencer.name)
    private campaignInfluencerModel: Model<CampaignInfluencerDocument>,
  ) {}

  async create(
    createCampaignInfluencerDto: CreateCampaignInfluencerDto,
  ): Promise<CampaignInfluencerDocument> {
    const newCampaignInfluencer = new this.campaignInfluencerModel(
      createCampaignInfluencerDto,
    );
    return newCampaignInfluencer.save();
  }

  async findAll(): Promise<CampaignInfluencerDocument[]> {
    return this.campaignInfluencerModel.find().exec();
  }

  async findByCampaignId(
    campaignId: string,
  ): Promise<CampaignInfluencerDocument[]> {
    if (!isValidObjectId(campaignId)) {
      throw new NotFoundException(`Invalid campaign ID format: ${campaignId}`);
    }

    return this.campaignInfluencerModel.find({ campaignId }).exec();
  }

  async findByInfluencerId(
    influencerId: string,
  ): Promise<CampaignInfluencerDocument[]> {
    if (!isValidObjectId(influencerId)) {
      throw new NotFoundException(
        `Invalid influencer ID format: ${influencerId}`,
      );
    }

    return this.campaignInfluencerModel.find({ influencerId }).exec();
  }

  async findOne(id: string): Promise<CampaignInfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(
        `Invalid campaign influencer ID format: ${id}`,
      );
    }

    const campaignInfluencer = await this.campaignInfluencerModel
      .findById(id)
      .exec();
    if (!campaignInfluencer) {
      throw new NotFoundException(
        `Campaign influencer with ID ${id} not found`,
      );
    }
    return campaignInfluencer;
  }

  async update(
    id: string,
    updateCampaignInfluencerDto: UpdateCampaignInfluencerDto,
  ): Promise<CampaignInfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(
        `Invalid campaign influencer ID format: ${id}`,
      );
    }

    const updatedCampaignInfluencer = await this.campaignInfluencerModel
      .findByIdAndUpdate(id, updateCampaignInfluencerDto, { new: true })
      .exec();

    if (!updatedCampaignInfluencer) {
      throw new NotFoundException(
        `Campaign influencer with ID ${id} not found`,
      );
    }

    return updatedCampaignInfluencer;
  }

  async remove(id: string): Promise<CampaignInfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(
        `Invalid campaign influencer ID format: ${id}`,
      );
    }

    const deletedCampaignInfluencer = await this.campaignInfluencerModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedCampaignInfluencer) {
      throw new NotFoundException(
        `Campaign influencer with ID ${id} not found`,
      );
    }

    return deletedCampaignInfluencer;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Influencer, InfluencerDocument } from './schemas/influencer.schema';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';

@Injectable()
export class InfluencersService {
  constructor(
    @InjectModel(Influencer.name)
    private influencerModel: Model<InfluencerDocument>,
  ) {}

  async create(
    createInfluencerDto: CreateInfluencerDto,
  ): Promise<InfluencerDocument> {
    const newInfluencer = new this.influencerModel(createInfluencerDto);
    return newInfluencer.save();
  }

  async findAll(): Promise<InfluencerDocument[]> {
    return this.influencerModel.find().exec();
  }

  async findOne(id: string): Promise<InfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid influencer ID format: ${id}`);
    }

    const influencer = await this.influencerModel.findById(id).exec();
    if (!influencer) {
      throw new NotFoundException(`Influencer with ID ${id} not found`);
    }
    return influencer;
  }

  async update(
    id: string,
    updateInfluencerDto: UpdateInfluencerDto,
  ): Promise<InfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid influencer ID format: ${id}`);
    }

    const updatedInfluencer = await this.influencerModel
      .findByIdAndUpdate(id, updateInfluencerDto, { new: true })
      .exec();

    if (!updatedInfluencer) {
      throw new NotFoundException(`Influencer with ID ${id} not found`);
    }

    return updatedInfluencer;
  }

  async remove(id: string): Promise<InfluencerDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid influencer ID format: ${id}`);
    }

    const deletedInfluencer = await this.influencerModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedInfluencer) {
      throw new NotFoundException(`Influencer with ID ${id} not found`);
    }

    return deletedInfluencer;
  }
}

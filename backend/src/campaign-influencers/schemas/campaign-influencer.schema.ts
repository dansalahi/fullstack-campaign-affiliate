import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CampaignInfluencerDocument = CampaignInfluencer & Document;

@Schema({ timestamps: true })
export class CampaignInfluencer {
  @ApiProperty({ description: 'Reference to a campaign' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaignId: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: 'Reference to an influencer' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Influencer',
    required: true,
  })
  influencerId: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: 206400,
    description: 'Actual cost for this campaign (may differ from baseCost)',
  })
  @Prop({ required: true, type: Number })
  cost: number;

  @ApiProperty({
    example: 10,
    description: 'How many coupons assigned to this influencer',
  })
  @Prop({ required: true, type: Number })
  assignedCoupons: number;

  @ApiProperty({
    example: 'active',
    description: 'Status of the campaign-influencer relationship',
    enum: ['invited', 'active', 'completed', 'declined', 'cancelled'],
  })
  @Prop({
    required: true,
    enum: ['invited', 'active', 'completed', 'declined', 'cancelled'],
    default: 'invited',
  })
  status: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CampaignInfluencerSchema =
  SchemaFactory.createForClass(CampaignInfluencer);

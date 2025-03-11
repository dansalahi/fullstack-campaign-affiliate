import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InfluencerDocument = Influencer & Document;

@Schema({ timestamps: true })
export class Influencer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true, type: Number })
  followers: number;

  @Prop({ required: true, enum: ['verified', 'pending', 'rejected'] })
  status: string;

  @Prop({ required: true, type: Number })
  baseCost: number;

  @Prop({ required: true })
  avatar: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);

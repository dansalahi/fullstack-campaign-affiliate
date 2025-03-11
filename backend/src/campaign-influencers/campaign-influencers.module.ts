import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignInfluencersController } from './campaign-influencers.controller';
import { CampaignInfluencersService } from './campaign-influencers.service';
import {
  CampaignInfluencer,
  CampaignInfluencerSchema,
} from './schemas/campaign-influencer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampaignInfluencer.name, schema: CampaignInfluencerSchema },
    ]),
  ],
  controllers: [CampaignInfluencersController],
  providers: [CampaignInfluencersService],
  exports: [CampaignInfluencersService],
})
export class CampaignInfluencersModule {}

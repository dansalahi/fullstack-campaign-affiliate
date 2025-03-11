import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { CampaignInfluencersModule } from '../campaign-influencers/campaign-influencers.module';
import { InfluencersModule } from '../influencers/influencers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    CampaignInfluencersModule,
    InfluencersModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}

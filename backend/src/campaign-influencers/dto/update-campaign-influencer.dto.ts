import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignInfluencerDto } from './create-campaign-influencer.dto';

export class UpdateCampaignInfluencerDto extends PartialType(
  CreateCampaignInfluencerDto,
) {}

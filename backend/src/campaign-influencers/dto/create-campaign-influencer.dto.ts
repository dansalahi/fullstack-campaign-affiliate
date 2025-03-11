import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsMongoId,
  Min,
} from 'class-validator';

export class CreateCampaignInfluencerDto {
  @ApiProperty({
    description: 'The ID of the campaign',
    example: '64123456789abcdef',
  })
  @IsNotEmpty()
  @IsMongoId()
  campaignId: string;

  @ApiProperty({
    description: 'The ID of the influencer',
    example: '65123456789abcdef',
  })
  @IsNotEmpty()
  @IsMongoId()
  influencerId: string;

  @ApiProperty({
    description: 'The cost for this campaign-influencer relationship',
    example: 206400,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({
    description: 'Number of coupons assigned to this influencer',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  assignedCoupons: number;

  @ApiProperty({
    description: 'Status of the campaign-influencer relationship',
    enum: ['invited', 'active', 'completed', 'declined', 'cancelled'],
    example: 'invited',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['invited', 'active', 'completed', 'declined', 'cancelled'])
  status: string;
}

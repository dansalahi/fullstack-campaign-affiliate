import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateInfluencerDto {
  @ApiProperty({
    example: 'Michael Ryhe',
    description: 'The name of the influencer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'France',
    description: 'The country of the influencer',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    example: 1000000,
    description: 'The number of followers',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  followers: number;

  @ApiProperty({
    example: 'verified',
    description: 'The status of the influencer',
    enum: ['verified', 'pending', 'rejected'],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['verified', 'pending', 'rejected'])
  status: string;

  @ApiProperty({
    example: 200000,
    description: 'The base cost for the influencer',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  baseCost: number;

  @ApiProperty({
    example: '1.jpg',
    description: 'The avatar image of the influencer',
  })
  @IsNotEmpty()
  @IsString()
  avatar: string;
}

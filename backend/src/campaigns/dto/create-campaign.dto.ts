import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
  IsDate,
  IsNumber,
  IsPositive,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @ApiProperty({
    example: 'Summer Ebay affiliates',
    description: 'The name of the campaign',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Affiliate',
    description: 'The type of the campaign',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: 'https://www.ebay.com',
    description: 'The URL of the brand',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  brandUrl: string;

  @ApiProperty({
    example: ['France', 'Germany', 'China', 'Malaysia'],
    description: 'The countries where the campaign is available',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  countries: string[];

  @ApiProperty({
    example: '2023-12-15T00:00:00Z',
    description: 'The start date of the campaign',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-01-06T00:00:00Z',
    description: 'The end date of the campaign',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    example: 5,
    description: 'The discount value (fixed amount or percentage)',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({
    example: 100,
    description: 'The number of coupons available',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  couponsAvailable: number;
}

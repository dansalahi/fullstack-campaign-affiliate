import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CampaignInfluencersService } from './campaign-influencers.service';
import { CreateCampaignInfluencerDto } from './dto/create-campaign-influencer.dto';
import { UpdateCampaignInfluencerDto } from './dto/update-campaign-influencer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('campaign-influencers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaign-influencers')
export class CampaignInfluencersController {
  constructor(
    private readonly campaignInfluencersService: CampaignInfluencersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign influencer relationship' })
  @ApiResponse({
    status: 201,
    description: 'The campaign influencer has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCampaignInfluencerDto: CreateCampaignInfluencerDto) {
    return this.campaignInfluencersService.create(createCampaignInfluencerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign influencer relationships' })
  @ApiResponse({
    status: 200,
    description: 'Return all campaign influencer relationships.',
  })
  findAll() {
    return this.campaignInfluencersService.findAll();
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get all influencers for a specific campaign' })
  @ApiResponse({
    status: 200,
    description: 'Return all influencers for the specified campaign.',
  })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  findByCampaignId(@Param('campaignId') campaignId: string) {
    return this.campaignInfluencersService.findByCampaignId(campaignId);
  }

  @Get('influencer/:influencerId')
  @ApiOperation({ summary: 'Get all campaigns for a specific influencer' })
  @ApiResponse({
    status: 200,
    description: 'Return all campaigns for the specified influencer.',
  })
  @ApiResponse({ status: 404, description: 'Influencer not found.' })
  findByInfluencerId(@Param('influencerId') influencerId: string) {
    return this.campaignInfluencersService.findByInfluencerId(influencerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific campaign influencer relationship' })
  @ApiResponse({
    status: 200,
    description: 'Return the campaign influencer relationship.',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign influencer relationship not found.',
  })
  findOne(@Param('id') id: string) {
    return this.campaignInfluencersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign influencer relationship' })
  @ApiResponse({
    status: 200,
    description:
      'The campaign influencer relationship has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign influencer relationship not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignInfluencerDto: UpdateCampaignInfluencerDto,
  ) {
    return this.campaignInfluencersService.update(
      id,
      updateCampaignInfluencerDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign influencer relationship' })
  @ApiResponse({
    status: 200,
    description:
      'The campaign influencer relationship has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaign influencer relationship not found.',
  })
  remove(@Param('id') id: string) {
    return this.campaignInfluencersService.remove(id);
  }
}

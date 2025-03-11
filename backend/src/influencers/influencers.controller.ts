import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('influencers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('influencers')
export class InfluencersController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new influencer' })
  @ApiResponse({
    status: 201,
    description: 'The influencer has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createInfluencerDto: CreateInfluencerDto) {
    return this.influencersService.create(createInfluencerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all influencers' })
  @ApiResponse({ status: 200, description: 'Return all influencers.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.influencersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an influencer by id' })
  @ApiResponse({ status: 200, description: 'Return the influencer.' })
  @ApiResponse({ status: 404, description: 'Influencer not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string) {
    return this.influencersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an influencer' })
  @ApiResponse({
    status: 200,
    description: 'The influencer has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Influencer not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id') id: string,
    @Body() updateInfluencerDto: UpdateInfluencerDto,
  ) {
    return this.influencersService.update(id, updateInfluencerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an influencer' })
  @ApiResponse({
    status: 200,
    description: 'The influencer has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Influencer not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.influencersService.remove(id);
  }
}

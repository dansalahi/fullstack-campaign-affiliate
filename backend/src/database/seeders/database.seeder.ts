import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { InfluencersService } from '../../influencers/influencers.service';
import { CampaignInfluencersService } from '../../campaign-influencers/campaign-influencers.service';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private usersService: UsersService,
    private campaignsService: CampaignsService,
    private influencersService: InfluencersService,
    private campaignInfluencersService: CampaignInfluencersService,
    @InjectConnection() private connection: Connection,
  ) {}

  public async onModuleInit() {
    // await this.dropCollections();
    await this.seedUsers();
    await this.seedCampaigns();
    await this.seedInfluencers();
    await this.seedCampaignInfluencers();
    this.logger.log('Database seeding completed');
  }

  private async dropCollections() {
    this.logger.log('Dropping all collections...');

    try {
      const collections = await this.connection.db.collections();

      for (const collection of collections) {
        await collection.drop().catch((error) => {
          // Ignore "ns not found" errors as they indicate the collection doesn't exist
          if (error.code !== 26) {
            this.logger.error(
              `Error dropping collection ${collection.collectionName}:`,
              error.message,
            );
          }
        });
        this.logger.log(`Dropped collection: ${collection.collectionName}`);
      }

      this.logger.log('All collections dropped successfully');
    } catch (error) {
      this.logger.error('Error dropping collections:', error.message);
    }
  }

  private async seedUsers() {
    this.logger.log('🌱 Seeding users...');

    // Check if admin user exists
    const adminExists = await this.usersService.findByUsername('admin');
    if (!adminExists) {
      await this.usersService.create('admin', 'admin@example.com', 'admin123', [
        'admin',
      ]);
      this.logger.log('Admin user created');
    }

    // Check if regular user exists
    const userExists = await this.usersService.findByUsername('user');
    if (!userExists) {
      await this.usersService.create('user', 'user@example.com', 'user123', [
        'user',
      ]);
      this.logger.log('Regular user created');
    }
  }

  private async seedCampaigns() {
    this.logger.log('🌱 Seeding campaigns...');

    try {
      // Sample campaign data
      const campaignData = {
        name: 'Summer Ebay affiliates',
        type: 'Affiliate',
        brandUrl: 'https://www.ebay.com',
        countries: ['France', 'Germany', 'China', 'Malaysia'],
        startDate: new Date('2023-12-15T00:00:00Z'),
        endDate: new Date('2024-01-06T00:00:00Z'),
        discountValue: 5,
        couponsAvailable: 100,
      };

      await this.campaignsService.create(campaignData);
      this.logger.log('Sample campaign created');

      // Add more sample campaigns if needed
      const additionalCampaign = {
        name: 'Winter Amazon affiliates',
        type: 'Affiliate',
        brandUrl: 'https://www.amazon.com',
        countries: ['USA', 'Canada', 'UK'],
        startDate: new Date('2023-11-20T00:00:00Z'),
        endDate: new Date('2023-12-31T00:00:00Z'),
        discountValue: 10,
        couponsAvailable: 200,
      };

      await this.campaignsService.create(additionalCampaign);
      this.logger.log('Additional sample campaign created');
    } catch (error) {
      this.logger.error('Error seeding campaigns:', error.message);
    }
  }

  private async seedInfluencers() {
    this.logger.log('🌱 Seeding influencers...');

    try {
      // Sample influencer data
      const influencerData = {
        name: 'Michael Ryhe',
        country: 'France',
        followers: 1000000,
        status: 'verified',
        baseCost: 200000,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      };

      await this.influencersService.create(influencerData);
      this.logger.log('Sample influencer created');

      // Add more sample influencers if needed
      const additionalInfluencer = {
        name: 'Sophie Martin',
        country: 'Germany',
        followers: 750000,
        status: 'verified',
        baseCost: 150000,
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      };

      await this.influencersService.create(additionalInfluencer);
      this.logger.log('Additional sample influencer created');

      // Add one more sample influencer
      const thirdInfluencer = {
        name: 'Li Wei',
        country: 'China',
        followers: 2500000,
        status: 'pending',
        baseCost: 300000,
        avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
      };

      await this.influencersService.create(thirdInfluencer);
      this.logger.log('Third sample influencer created');
    } catch (error) {
      this.logger.error('Error seeding influencers:', error.message);
    }
  }

  private async seedCampaignInfluencers() {
    this.logger.log('🌱 Seeding campaign influencers...');

    try {
      // Get all campaigns and influencers
      const campaigns = await this.campaignsService.findAll();
      const influencers = await this.influencersService.findAll();

      if (campaigns.length === 0 || influencers.length === 0) {
        this.logger.warn(
          'No campaigns or influencers found for seeding campaign influencers',
        );
        return;
      }

      // Assign the first influencer to the first campaign
      const campaignInfluencerData1 = {
        campaignId: campaigns[0]._id.toString(),
        influencerId: influencers[0]._id.toString(),
        cost: 206400, // Slightly higher than base cost
        assignedCoupons: 10,
        status: 'active',
      };

      await this.campaignInfluencersService.create(campaignInfluencerData1);
      this.logger.log(
        `Campaign influencer created: ${influencers[0].name} assigned to ${campaigns[0].name}`,
      );

      // Assign the second influencer to the first campaign
      const campaignInfluencerData2 = {
        campaignId: campaigns[0]._id.toString(),
        influencerId: influencers[1]._id.toString(),
        cost: 155000, // Slightly higher than base cost
        assignedCoupons: 8,
        status: 'active',
      };

      await this.campaignInfluencersService.create(campaignInfluencerData2);
      this.logger.log(
        `Campaign influencer created: ${influencers[1].name} assigned to ${campaigns[0].name}`,
      );

      // Assign the third influencer to the second campaign
      if (campaigns.length > 1 && influencers.length > 2) {
        const campaignInfluencerData3 = {
          campaignId: campaigns[1]._id.toString(),
          influencerId: influencers[2]._id.toString(),
          cost: 310000, // Slightly higher than base cost
          assignedCoupons: 15,
          status: 'invited',
        };

        await this.campaignInfluencersService.create(campaignInfluencerData3);
        this.logger.log(
          `Campaign influencer created: ${influencers[2].name} assigned to ${campaigns[1].name}`,
        );
      }

      // Assign the first influencer to the second campaign as well
      if (campaigns.length > 1) {
        const campaignInfluencerData4 = {
          campaignId: campaigns[1]._id.toString(),
          influencerId: influencers[0]._id.toString(),
          cost: 210000, // Different cost for different campaign
          assignedCoupons: 12,
          status: 'active',
        };

        await this.campaignInfluencersService.create(campaignInfluencerData4);
        this.logger.log(
          `Campaign influencer created: ${influencers[0].name} assigned to ${campaigns[1].name}`,
        );
      }
    } catch (error) {
      this.logger.error('Error seeding campaign influencers:', error.message);
    }
  }
}

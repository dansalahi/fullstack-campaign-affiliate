import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { InfluencersService } from '../../influencers/influencers.service';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private usersService: UsersService,
    private campaignsService: CampaignsService,
    private influencersService: InfluencersService,
    @InjectConnection() private connection: Connection,
  ) {}

  public async onModuleInit() {
    await this.dropCollections();
    await this.seedUsers();
    await this.seedCampaigns();
    await this.seedInfluencers();
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
        avatar: '1.jpg',
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
        avatar: '2.jpg',
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
        avatar: '3.jpg',
      };

      await this.influencersService.create(thirdInfluencer);
      this.logger.log('Third sample influencer created');
    } catch (error) {
      this.logger.error('Error seeding influencers:', error.message);
    }
  }
}

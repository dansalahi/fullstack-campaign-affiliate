import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSeeder } from './seeders/database.seeder';
import { UsersModule } from '../users/users.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app',
    ),
    UsersModule,
    CampaignsModule,
  ],
  providers: [DatabaseSeeder],
})
export class DatabaseModule {}

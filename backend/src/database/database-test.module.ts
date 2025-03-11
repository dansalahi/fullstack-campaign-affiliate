import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UsersModule } from '../users/users.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DatabaseSeeder } from './seeders/database.seeder';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return {
          uri,
        };
      },
    }),
    UsersModule,
    CampaignsModule,
  ],
  providers: [DatabaseSeeder],
})
export class DatabaseTestModule {
  static async closeDatabase() {
    if (mongod) await mongod.stop();
  }
}

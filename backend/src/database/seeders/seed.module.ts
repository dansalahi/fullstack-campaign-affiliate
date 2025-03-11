import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedCommand } from './seed.command';
import { UsersModule } from '../../users/users.module';
import { DatabaseSeeder } from './database.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app',
    ),
    UsersModule,
  ],
  providers: [SeedCommand, DatabaseSeeder],
})
export class SeedModule {}

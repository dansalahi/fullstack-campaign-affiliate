import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private usersService: UsersService,
    @InjectConnection() private connection: Connection,
  ) {}

  public async onModuleInit() {
    await this.dropCollections();
    await this.seedUsers();
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
    this.logger.log('Seeding users...');

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
}

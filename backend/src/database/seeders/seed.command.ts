import { Command, CommandRunner } from 'nest-commander';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseSeeder } from './database.seeder';

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);

  constructor(private databaseSeeder: DatabaseSeeder) {
    super();
  }

  async run(): Promise<void> {
    try {
      this.logger.log('Starting database seeding process...');

      // This will first drop all collections and then seed the database
      await this.databaseSeeder.onModuleInit();

      this.logger.log('Database seeding completed successfully');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during database seeding:', error.message);
      process.exit(1);
    }
  }
}

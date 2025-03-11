import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
@Command({ name: 'seed', description: 'Seed the database with initial data' })
export class SeedCommand extends CommandRunner {
  constructor(private usersService: UsersService) {
    super();
  }

  async run(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    await this.seedUsers();

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  }

  private async seedUsers() {
    console.log('Seeding users...');

    // Check if admin user exists
    const adminExists = await this.usersService.findByUsername('admin');
    if (!adminExists) {
      console.log('Creating admin user...');
      await this.usersService.create('admin', 'admin123', 'admin');
    } else {
      console.log('Admin user already exists, skipping...');
    }

    // Check if regular user exists
    const userExists = await this.usersService.findByUsername('user');
    if (!userExists) {
      console.log('Creating regular user...');
      await this.usersService.create('user', 'user123', 'user');
    } else {
      console.log('Regular user already exists, skipping...');
    }
  }
}

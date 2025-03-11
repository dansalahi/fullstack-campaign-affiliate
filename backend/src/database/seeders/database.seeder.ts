import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    // Check if admin user exists
    const adminExists = await this.usersService.findByUsername('admin');
    if (!adminExists) {
      await this.usersService.create('admin', 'admin@example.com', 'admin123', [
        'admin',
      ]);
    }

    // Check if regular user exists
    const userExists = await this.usersService.findByUsername('user');
    if (!userExists) {
      await this.usersService.create('user', 'user@example.com', 'user123', [
        'user',
      ]);
    }
  }
}

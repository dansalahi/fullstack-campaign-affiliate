import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      return null;
    }

    // Don't include password in the returned user object
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email is already in use
    const existingEmail = await this.usersService.findByEmail(
      registerDto.email.toLowerCase(),
    );
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // Create new user
    const roles = registerDto.roles ? [registerDto.roles] : ['user'];
    const user = await this.usersService.create(
      registerDto.username,
      registerDto.email.toLowerCase(),
      registerDto.password,
      roles,
    );

    // Generate JWT token
    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    const user = await this.usersService.create({
      email: authDto.email,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    
    if (!user || !user.password) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
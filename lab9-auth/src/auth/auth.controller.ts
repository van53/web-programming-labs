import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: Omit<User, 'password'>) {
    return user;
  }
}   
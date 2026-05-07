import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

// 1. ВИПРАВЛЕНО ШЛЯХ ІМПОРТУ (якщо файл лежить поруч із auth.module.ts)
import { JwtStrategy } from './strategies/jwt.strategy'; 

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        
        // 2. ДОДАНО "as any", щоб задовольнити суворий компілятор TypeScript
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any 
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
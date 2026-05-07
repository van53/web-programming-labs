import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty()
  email: string;

  @MinLength(6, { message: 'Пароль має містити щонайменше 6 символів' })
  @IsNotEmpty()
  password: string;
}
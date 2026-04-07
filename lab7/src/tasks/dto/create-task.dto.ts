import { IsString, IsNotEmpty, IsIn, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва не може бути порожньою' })
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(['low', 'medium', 'high'], {
    message: 'Пріоритет має бути: low, medium або high',
  })
  priority: 'low' | 'medium' | 'high';
}
import { IsString, IsNotEmpty, IsIn, IsOptional, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
  
  @IsOptional()
  @IsIn(['todo', 'in-progress', 'done'])
  status?: 'todo' | 'in-progress' | 'done';
}
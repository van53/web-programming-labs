import { Controller, Get, Post, Patch, Delete, Param, Body, Query, NotFoundException, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('search')
  findByStatus(@Query('status') status: string) {
    return this.tasksService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const task = this.tasksService.findOne(id);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const updatedTask = this.tasksService.update(id, dto);
    if (!updatedTask) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return updatedTask;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const removed = this.tasksService.remove(id);
    if (!removed) throw new NotFoundException(`Завдання #${id} не знайдено`);
  }
}
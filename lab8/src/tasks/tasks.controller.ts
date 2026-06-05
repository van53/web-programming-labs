import { Controller, Get, Post, Patch, Delete, Param, Body, Query, NotFoundException, HttpCode, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get('search')
  async findByStatus(@Query('status') status: string) {
    return this.tasksService.findByStatus(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.update(id, dto);
    if (!updatedTask) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return updatedTask;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removed = await this.tasksService.remove(id);
    if (!removed) throw new NotFoundException(`Завдання #${id} не знайдено`);
  }
}
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";

@Controller("tasks")
export class TasksController {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Підготувати звіт',
      description: 'Доробити звіт по 6 лабі',
      status: 'pending',
      priority: 'high',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Вивчити NestJS',
      description: 'Прочитати про контролери',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Здати лабу',
      description: 'Завантажити на GitHub',
      status: 'done',
      priority: 'low',
      createdAt: new Date().toISOString()
    }
  ];

  @Get()
  findAll(): Task[] {
    return this.tasks;
  }

  @Get("search")
  findByStatus(@Query("status") status?: string): Task[] {
    if (!status) return this.tasks;
    return this.tasks.filter(task => task.status === status);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Task | { message: string } {
    const task = this.tasks.find(task => task.id === id);
    return task || { message: `Task with ID ${id} not found` };
  }

  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: dto.title,
      description: dto.description || '',
      status: 'pending',
      priority: dto.priority,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  @Delete(":id")
  remove(@Param("id") id: string): { message: string } {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return { message: `Task with ID ${id} not found` };
    }
    this.tasks.splice(index, 1);
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
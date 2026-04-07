import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  // Початковий масив з 3+ задачами згідно з вимогами
  private tasks: Task[] = [
    { 
      id: '1', 
      title: 'Налаштувати проєкт', 
      status: 'done', 
      priority: 'high', 
      createdAt: new Date() 
    },
    { 
      id: '2', 
      title: 'Реалізувати Сервіс', 
      status: 'in-progress', 
      priority: 'medium', 
      createdAt: new Date() 
    },
    { 
      id: '3', 
      title: 'Протестувати API', 
      status: 'todo', 
      priority: 'low', 
      createdAt: new Date() 
    },
  ];

  // Повертає всі задачі
  findAll(): Task[] {
    return this.tasks;
  }

  // Пошук за статусом (для GET /tasks/search?status=...)
  findByStatus(status: string): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  // Повертає об'єкт або null (Контролер сам вирішить, чи кидати 404)
  findOne(id: string): Task | null {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  // Створення нової задачі
  create(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      ...dto,
      status: 'todo', // Статус за замовчуванням
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // Оновлення задачі. Повертає null, якщо id не знайдено
  update(id: string, dto: UpdateTaskDto): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = { ...this.tasks[index], ...dto };
    return this.tasks[index];
  }

  // Видалення. Повертає boolean для контролера
  remove(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    return true;
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: { tags: true } });
  }

  findByStatus(status: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { status: status as any },
      relations: { tags: true },
    });
  }

  findOne(id: number): Promise<Task | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const { tagIds, ...taskData } = dto;
    const task = this.tasksRepository.create(taskData);

    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagsRepository.find({
        where: { id: In(tagIds) },
      });
      task.tags = tags;
    }

    return this.tasksRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.findOne(id);
    if (!task) return null;

    const { tagIds, ...updateData } = dto;
    Object.assign(task, updateData);

    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await this.tagsRepository.find({
          where: { id: In(tagIds) },
        });
        task.tags = tags;
      } else {
        task.tags = [];
      }
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
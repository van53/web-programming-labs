import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag | null> {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) return null;
    
    Object.assign(tag, updateTagDto);
    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tagsRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

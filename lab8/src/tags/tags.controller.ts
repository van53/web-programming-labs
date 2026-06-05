import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, HttpCode, ParseIntPipe } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  async findAll() {
    return this.tagsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
    const updatedTag = await this.tagsService.update(id, updateTagDto);
    if (!updatedTag) throw new NotFoundException(`Тег #${id} не знайдено`);
    return updatedTag;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removed = await this.tagsService.remove(id);
    if (!removed) throw new NotFoundException(`Тег #${id} не знайдено`);
  }
}

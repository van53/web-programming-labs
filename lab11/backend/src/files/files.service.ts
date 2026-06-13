import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface FileMetadata {
  id: string;
  originalName: string;
  generatedName: string;
  size: number;
  mimetype: string;
  url: string;
}

@Injectable()
export class FilesService {
  private files: FileMetadata[] = [];
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  saveFileMetadata(metadata: FileMetadata) {
    this.files.push(metadata);
    return metadata;
  }

  getAllFiles() {
    return this.files;
  }

  getFilePath(generatedName: string): string {
    const filePath = path.join(this.uploadPath, generatedName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не знайдено');
    }
    return filePath;
  }
}

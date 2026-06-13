import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Get, Param, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import type { Response, Request } from 'express';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard limit in Multer
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      }
    })
  }))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const fileUrl = `${req.protocol}://${req.get('host')}/files/${file.filename}`;
    
    return this.filesService.saveFileMetadata({
      id: file.filename, // Using filename as ID for simplicity
      originalName: file.originalname,
      generatedName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      url: fileUrl,
    });
  }

  @Get()
  getAllFiles() {
    return this.filesService.getAllFiles();
  }

  @Get(':name')
  getFile(@Param('name') name: string, @Res() res: Response) {
    const filePath = this.filesService.getFilePath(name);
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}

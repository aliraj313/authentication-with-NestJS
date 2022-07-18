import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadService {
  createImage(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
  createSound(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
}

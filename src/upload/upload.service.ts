import { MimeType, S3Service } from './s3.service';
import { BaseService } from './../base.service';
import { v4 as uuidv5 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService extends BaseService {
  constructor(private readonly s3Service: S3Service) {
    super();
  }

  async createImage(image: Express.Multer.File) {
    const imageLimitKilobyte = 10000; //10000 = 10 Megabytes
    this.s3Service.fileValidation(image);
    this.s3Service.sizeValidation(image, imageLimitKilobyte);
    this.s3Service.mimeTypeValidation(image, [MimeType.png, MimeType.jpeg]);
    const fileName = uuidv5() + '.png';
    const result = await this.s3Service.uploadFile(fileName, image);
    return result;
  }
}

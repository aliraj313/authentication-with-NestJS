import { MimeType, S3Service } from './s3.service';
import { BaseService } from './../base.service';
import { v4 as uuidv5 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ImagesService } from './image/image.service';

@Injectable()
export class UploadService extends BaseService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imagesService: ImagesService,
  ) {
    super();
  }

  private async uploadWithComparision(
    file: Buffer,
    fileName: string,
    folderName: string,
  ) {
    return await this.s3Service.uploadFileWithBuffer(
      folderName,
      fileName,
      file,
    );
  }
  async uploadAvatar(buffer: Buffer) {
    const fileName = `image-avatar-${Date.now()}` + '.png';
    const result = await this.uploadWithComparision(
      buffer,
      fileName,
      '/images/avatars',
    );
    this.imagesService.createImage(result.image_link)
    return result;
  }

  async uploadChatImage(buffer: Buffer) {
    const fileName = `image-chat-${Date.now()}` + '.png';
    const result = await this.uploadWithComparision(
      buffer,
      fileName,
      '/images/chats',
    );
    this.imagesService.createImage(result.image_link)
    return result;
  }

  // validationFile(image: Express.Multer.File) {
  //   const imageLimitKilobyte = 10000; //10000 = 10 Megabytes
  //   this.s3Service.fileValidation(image);
  //   // this.s3Service.sizeValidation(image, imageLimitKilobyte);
  //   // this.s3Service.mimeTypeValidation(image, [MimeType.png, MimeType.jpeg]);
  // }

  async deleteImage(url: string) {
    if (url.length > 0) {
      await this.s3Service.deleteFile(url);
      return this.responseSuccess('فایل مورد نظر پاک شد');
    }
  }
}

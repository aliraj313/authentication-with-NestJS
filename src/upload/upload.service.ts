import { BaseService } from './../base.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { S3 } from 'aws-sdk';
import { v4 as uuidv5 } from 'uuid';

@Injectable()
export class UploadService extends BaseService {
  private readonly maxLimitByte = 300 * 1000; //kilobyte

  private s3;
  constructor() {
    super();
    this.s3 = new S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_KEY_ID,
      endpoint: process.env.S3_ENDPOINT,
      s3ForcePathStyle: true,
    });
  }

  async createImage(image: Express.Multer.File) {
    const imageLimitKilobyte = 100; //10000 = 10 Megabytes
    this.fileValidation(image);
    this.sizeValidation(image, imageLimitKilobyte);
    this.mimeTypeValidation(image, [MimeType.png,MimeType.jpeg]);
    const fileName = uuidv5() + '.png';
    const result = await this.uploadFile(fileName, image);
    return result;
  }
  createSound(file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }

  async uploadFile(fileName: string, file: Express.Multer.File) {
    const response = await this.s3
      .upload({
        Bucket: process.env.BUCKET,
        Body: file.buffer,
        Key: fileName,
        ACL: 'public-read',
      })
      .promise();
    console.log('response = ', response);
    return response;
    // return {
    //   code: 200,
    //   image_url: process.env.IMAGE_URL_ENDPOINT + '/' + fileName,
    // };
  }

  fileValidation(file: Express.Multer.File) {
    if (!file) {
      this.throwError(
        'لطفا فایلی برای ارسال انتخاب کنید',
        HttpStatus.NOT_FOUND,
      );
    }
  }
  mimeTypeValidation(file: Express.Multer.File, acceptedMimtypes: MimeType[]) {
    const result = acceptedMimtypes.some(
      (mimeType) => file.mimetype == mimeType,
    );
    console.log('result = ', result);
    if (!result) {
      this.throwError(
        'فرمت فایل قابل قبول نیست',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }

  sizeValidation(
    file: Express.Multer.File,
    sizeAccepted: number, // 60 = 60 kilobytes
  ) {
    const kilobytesVolum = sizeAccepted < 1000;
    const message = `حجم فایل باید کمتر از ${
      kilobytesVolum ? sizeAccepted : sizeAccepted / 1000
    } ${kilobytesVolum ? 'کیلوبایت' : 'مگابایت'} باشد`;
    const sizeKilo = sizeAccepted * 1000;
    if (file.size > sizeKilo) {
      this.throwError(message, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}

const enum MimeType {
  mp3 = 'audio/mpeg',
  png = 'image/png',
  jpeg = 'image/jpeg',
  mkv = '',
}

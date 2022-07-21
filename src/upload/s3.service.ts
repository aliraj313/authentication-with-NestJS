import { BaseService } from 'src/base.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service extends BaseService {
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
export const enum MimeType {
  mp3 = 'audio/mpeg',
  png = 'image/png',
  jpeg = 'image/jpeg',
  mkv
   = 'video/x-matroska',
}

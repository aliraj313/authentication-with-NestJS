import { BaseService } from 'src/base.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ImagesService } from './image/image.service';

@Injectable()
export class S3Service extends BaseService {
  private s3;
  constructor(private readonly imagesService: ImagesService) {
    super();
    this.s3 = new S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_KEY_ID,
      endpoint: process.env.S3_ENDPOINT,
      s3ForcePathStyle: true,
    });
  }

  async generateLink(key: string) {
    const params = {
      Bucket: process.env.BUCKET,
      Key: key,
      Expires: 60, // expires in 60 seconds
    };
    const link: string = await this.s3.getSignedUrl('getObject', params);
    return link;
  }

  async deleteFile(url: string) {
    //  https://storage.iran.liara.space/avazeh-space/images/avatars/d4e8916f-a747-4856-8be6-05bb32987cc8.png
    //const key = url.split(process.env.IMAGE_URL_ENDPOINT)[1];
    let params = {
      Bucket: process.env.BUCKET,
      Key: url,
    };
    //   console.log('IMAGE_URL_ENDPOINT = ', process.env.IMAGE_URL_ENDPOINT);
    console.log('params = ', params);
    try {
      return await this.s3.deleteObject(params).promise();
    } catch (error) {}
  }

  async uploadFile(
    folderName: string,
    fileName: string,
    file: Express.Multer.File,
  ) {
    const response = await this.s3
      .upload({
        Bucket: process.env.BUCKET + folderName,
        Body: file.buffer,
        Key: fileName,
        ACL: 'public-read',
      })
      .promise();
    console.log('response = ', response);
    const imageKey = response.Key;
    this.imagesService.createImage(imageKey);
    return {
      // image_link: process.env.IMAGE_URL_ENDPOINT + response.Key,
      image_link: imageKey,
    };
  }
  async uploadFileWithBuffer(
    folderName: string,
    fileName: string,
    buffer: Buffer,
  ) {
    console.log("folderName = ",folderName)
    console.log("fileName = ",fileName)
    console.log("buffer = ",buffer)
    const response = await this.s3
      .upload({
        Bucket: process.env.BUCKET + folderName,
        Body: buffer,
        Key: fileName,
        ACL: 'public-read',
      })
      .promise();
    console.log('response = ', response);
    return {
      //  image_link: process.env.IMAGE_URL_ENDPOINT + response.Key,
      image_link: response.Key,
    };
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
  mkv = 'video/x-matroska',
}

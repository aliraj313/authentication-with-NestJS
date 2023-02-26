import { S3Service } from '../s3.service';
import { BaseService } from 'src/base.service';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageDocument, Image } from './image.entity';

@Injectable()
export class ImagesService extends BaseService {
  constructor(
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {
    super();
  }

  createImage(key: string) {
    new this.imageModel({ key: key }).save();
  }

  async showImage(key: string) {
    const link = await this.s3Service.generateLink(key);
    const token = link.split(key)[1];
    const url = `${process.env.BASE_STORAGE_URL}${key}${token}`;
    return {
      statusCode: HttpStatus.FOUND,
      url: url,
    };
  }
}

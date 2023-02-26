import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { S3Service } from './s3.service';
import { ImagesService } from './image/image.service';
import { ImageAccessController as ImagesController } from './image/image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './image/image.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],

  controllers: [UploadController, ImagesController],
  providers: [UploadService, S3Service, ImagesService],
  exports: [UploadService],
})
export class UploadModule {}

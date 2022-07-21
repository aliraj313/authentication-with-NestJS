import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

/*

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  test(
    @UploadedFile(new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    file: Express.Multer.File) {
    console.log(file);
    return this.uploadService.createImage(file);
  }
  */


  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.uploadService.createImage(file);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('sound'))
  uploadSingleSound(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.uploadService.createSound(file);
  }
}

import { AuthGuard } from './../auth/auth.guard';
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
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/user/role/role.guard';
import { Roles } from 'src/user/role/roles.decorator';
import { RoleInfo } from 'src/user/entities/role.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RoleInfo.Admin,RoleInfo.Owner)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.uploadService.createImage(file);
  }

  
}

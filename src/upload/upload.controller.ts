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
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageSharpPipe } from './sharp-image.pipe';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @Post('image/avatar')
  @UseInterceptors(FileInterceptor('image'))
  uploadAvatar(@UploadedFile(ImageSharpPipe) buffer: Buffer) {
    return this.uploadService.uploadAvatar(buffer);
  }

  @UseGuards(AuthGuard)
  @Post('image/chat')
  @UseInterceptors(FileInterceptor('image'))
  uploadChatImage(@UploadedFile(ImageSharpPipe) buffer: Buffer) {
    return this.uploadService.uploadChatImage(buffer);
  }
}

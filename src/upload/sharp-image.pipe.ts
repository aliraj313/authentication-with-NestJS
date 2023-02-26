import { HttpStatus } from '@nestjs/common';
import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageSharpPipe
  implements PipeTransform<Express.Multer.File, Promise<Buffer>>
{
  async transform(image: Express.Multer.File): Promise<Buffer> {
    this.validation(image)
    const buffer = await sharp(image.buffer)
      .resize(900)
      .png({ effort: 5, quality: 80 })
      .toBuffer();
    return buffer;
  }
  
  validation(image: Express.Multer.File){
    if(!image){
      throw new HttpException("فایل معتبر نیست",HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    
  }
}

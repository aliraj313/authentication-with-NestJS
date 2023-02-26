import { Controller } from '@nestjs/common';
import { ImagesService } from './image.service';

@Controller('images')
export class ImageAccessController {
  constructor(private readonly accessImageService: ImagesService) {}

  // @Redirect()
  // @UseGuards(ImageGuard)
  // @Get('avatars/:key')
  // showAvatarImage(@Param('key') imageName: string) {
  //   const key = `images/avatars/${imageName}`;
  //   return this.accessImageService.showImage(key);
  // }

  // @Redirect()
  // @UseGuards(AuthGuard)
  // @Get('portfolios/:key')
  // showPortfoliosImage(@Param('key') imageName: string) {
  //   const key = `images/portfolios/${imageName}`;
  //   return this.accessImageService.showImage(key);
  // }

  // @Redirect()
  // @UseGuards(AuthGuard)
  // @Get('chats/:key')
  // showChatsImage(@Param('key') imageName: string) {
  //   const key = `images/chats/${imageName}`;
  //   return this.accessImageService.showImage(key);
  // }
}

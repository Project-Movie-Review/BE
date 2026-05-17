import { Controller, Delete, Get, Param, Res, Post, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/interceptors/multer.interceptor';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('imageUrls', 10, multerOptions))
  async uploadImages(@UploadedFiles() imageUrls: Express.Multer.File[]) {
    return this.imageService.uploadImages(imageUrls);
  }

  @Get(':imageName')
  async viewImage(@Param('imageName') imageName: string, @Res() res: any) {
    const imagePath = await this.imageService.viewImage(imageName);
    return res.sendFile(imagePath);
  }

  @Delete(':imageName')
  @UseGuards(JwtGuard)
  async deleteImage(@Param('imageName') imageName: string) {
    return this.imageService.deleteImage(imageName);
  }
}

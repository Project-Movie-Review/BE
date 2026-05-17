import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [SequelizeModule.forFeature([User])],
})
export class ImageModule {}

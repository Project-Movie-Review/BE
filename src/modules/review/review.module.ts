import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from 'src/models';
import { SentimentModule } from '../sentiment/sentiment.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [SequelizeModule.forFeature([Review]), SentimentModule, HttpModule],
})
export class ReviewModule {}

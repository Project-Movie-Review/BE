import { Body, Controller, Get, Param, Post, Req, UseGuards, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { FilterReviewDto } from './dto/filter-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async createReview(@Body() dto: CreateReviewDto, @Req() req) {
    const userId = req.user.id;
    return this.reviewService.createReview(dto, userId);
  }

  @Get(':movieId')
  async getReviewsByMovie(@Req() req, @Param('movieId') movieId: number, @Query() dto: FilterReviewDto) {
    return this.reviewService.getAndFilterReviews(movieId, dto);
  }
}

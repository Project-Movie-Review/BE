import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review, User } from 'src/models';
import { SentimentService } from '../sentiment/sentiment.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ReviewResponseDto } from './dto/review.response.dto';
import { plainToInstance } from 'class-transformer';
import { FilterReviewDto } from './dto/filter-review.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    constructor(
        @InjectModel(Review) private reviewModel: typeof Review,
        private sentimentService: SentimentService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async getTmdbReviews(movieId: number, page: number = 1) {
        const url = `${this.baseUrl}/movie/${movieId}/reviews`;

        const { data } = await firstValueFrom(
            this.httpService.get(url, {
                params: {
                    api_key: process.env.MOVIE_API_KEY,
                    language: 'en-US',
                    page: page,
                },
            }),
        );

        return data.results || [];
    }


    async getReviewsByMovieId(movieId: number) {
        // 1. Lấy reviews từ Database của mình
        const localReviews = await this.reviewModel.findAll({
            where: { movieId },
            include: [
                {
                    model: User,
                    attributes: ['username', 'avatar'],
                },
            ],
            raw: true,
        });

        // 2. Lấy reviews từ TMDB (dữ liệu bạn vừa gửi)
        let tmdbReviews = [];
        try {
            const tmdbData = await this.getTmdbReviews(movieId);
            tmdbReviews = tmdbData
        } catch (error) {
            console.error('Lỗi khi lấy TMDB reviews:', error);
        }

        // 3. Chuẩn hóa dữ liệu Local
        const mappedLocal: ReviewResponseDto[] = localReviews.map(r => ({
            author: r['user.username'] || 'Unknown User', // destructure để lấy username từ bảng User
            avatar: r['user.avatar'] || null,
            content: r.content,
            rating: r.rating,
            sentiment: r.sentiment,
            createdAt: r.createdAt.toISOString(),
            source: 'local',
        }));

        // 4. Map TMDB Result sang DTO
        const mappedTmdb: ReviewResponseDto[] = tmdbReviews.map(r => ({
            author: r.author,
            content: r.content,
            rating: r.author_details?.rating || null,
            sentiment: this.sentimentService.analyze(r.content),
            createdAt: r.created_at,
            source: 'tmdb',
            avatar: r.author_details?.avatar_path
                ? `https://image.tmdb.org/t/p/w500${r.author_details.avatar_path}`
                : null,
        }));

        return plainToInstance(ReviewResponseDto, [...mappedLocal, ...mappedTmdb], {
            excludeExtraneousValues: true
        });
    }

    async getAndFilterReviews(movieId: number, dto: FilterReviewDto) {
        const reviews = await this.getReviewsByMovieId(movieId);
        const { page, limit, sortBy, sortOrder } = dto;

        const limitPage = Number(limit || this.configService.get<number>('LIMIT'));
        const currentPage = Number(page || this.configService.get<number>('PAGE'));
        const offset = (currentPage - 1) * limitPage;

        const totalRatings = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = reviews.length ? (totalRatings / reviews.length).toFixed(1) : 0;

        let sortedReviews = reviews;
        if (sortBy && sortOrder) {
            sortedReviews = reviews.sort((a, b) => {
                // HANDLE DATE
                if (sortBy === 'createdAt') {
                    const aDate = new Date(a.createdAt).getTime();
                    const bDate = new Date(b.createdAt).getTime();
                    return sortOrder === 'asc'
                        ? aDate - bDate
                        : bDate - aDate;
                }

                // HANDLE STRING / NUMBER
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            sortedReviews = reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        const paginatedReviews = sortedReviews.slice(offset, offset + limitPage);
        return {
            items: paginatedReviews,
            avg: averageRating,
            paginationMeta: {
                totalItems: reviews.length,
                currentPage,
                limit: limitPage,
                totalPages: Math.ceil(reviews.length / limitPage),
            }
        };
    }

    async createReview(dto: CreateReviewDto, userId: number) {
        const sentimentLabel = this.sentimentService.analyze(dto.content);

        // Chặn spam
        const existingReview = await this.reviewModel.findOne({
            where: {
                movieId: dto.movieId,
                content: dto.content,
            }
        });
        if (existingReview) {
            throw new BadRequestException('Bạn đã gửi bình luận này trước đó. Vui lòng không spam.');
        }

        const newReview = await this.reviewModel.create({
            ...dto,
            userId,
            sentiment: sentimentLabel
        })

        return {
            message: 'Thêm bình luận thành công',
            data: newReview
        };
    }
}

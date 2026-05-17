import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { MovieListResponseDto } from './dto/movie-response.dto';
import { SearchMovieDto } from './dto/movie-search.dto';
import { ConfigService } from '@nestjs/config';
import { FilterMovieDto } from './dto/movie-filter.dto';

@Injectable()
export class MovieService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }
    private readonly tmdbUrl = 'https://api.themoviedb.org/3';

    async getTrendingMovies() {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.tmdbUrl}/trending/movie/week`, {
                params: {
                    api_key: process.env.MOVIE_API_KEY,
                    language: 'vi-VN',
                },
            }),
        );

        return plainToInstance(MovieListResponseDto, data.results, { excludeExtraneousValues: true });
    }

    async searchMovies(searchMovieDto: SearchMovieDto) {
        const { query, page, limit } = searchMovieDto;

        const params = {
            api_key: process.env.MOVIE_API_KEY,
            language: 'vi-VN',
            query: query || '',
            page: page || Number(this.configService.get<number>('PAGE')),
            limit: limit || Number(this.configService.get<number>('LIMIT')),
        };

        const { data } = await firstValueFrom(
            this.httpService.get(`${this.tmdbUrl}/search/movie`, { params }),
        );

        return {
            item: plainToInstance(MovieListResponseDto, data.results, {
                excludeExtraneousValues: true,
            }),
            pagination: {
                page: params.page,
                limit: params.limit,
                totalItems: data.total_results,
                totalPages: data.total_pages,
            },
        };
    }

    async filterMovies(filter: FilterMovieDto) {
        const {
            keyword,
            minRating,
            maxRating,
            minReleaseDate,
            maxReleaseDate,
            page,
            limit,
            sortBy,
            sortOrder,
        } = filter;

        if (minRating !== undefined && maxRating !== undefined && minRating > maxRating) {
            throw new BadRequestException('Invalid rating range');
        }

        if (minReleaseDate && maxReleaseDate && minReleaseDate > maxReleaseDate) {
            throw new BadRequestException('Invalid date range');
        }

        const params: any = {
            api_key: process.env.MOVIE_API_KEY,
            language: 'vi-VN',
            page: page || Number(this.configService.get<number>('PAGE')),
            limit: limit || Number(this.configService.get<number>('LIMIT')),
        };

        if(keyword) params['query'] = keyword; // bracket notation
        if (minRating) params['vote_average.gte'] = minRating;
        if (maxRating) params['vote_average.lte'] = maxRating;

        if (minReleaseDate) params['primary_release_date.gte'] = minReleaseDate;
        if (maxReleaseDate) params['primary_release_date.lte'] = maxReleaseDate;

        if (sortBy && sortOrder) {
            params.sort_by = `${sortBy}.${sortOrder}`;
        }

        const { data } = await firstValueFrom(
            this.httpService.get(`${this.tmdbUrl}/discover/movie`, { params }),
        );

        return {
            item: plainToInstance(MovieListResponseDto, data.results, {
                excludeExtraneousValues: true,
            }),
            pagination: {
                page: params['page'],
                limit: params['limit'],
                totalItems: data.total_results,
                totalPages: data.total_pages,
            },
        };
    }

    async getMovieDetails(movieId: number) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.tmdbUrl}/movie/${movieId}`, {
                params: {
                    api_key: process.env.MOVIE_API_KEY,
                    language: 'vi-VN',
                },
            }),
        );

        const actorsData = await firstValueFrom(
            this.httpService.get(`${this.tmdbUrl}/movie/${movieId}/credits`, {
                params: {
                    api_key: process.env.MOVIE_API_KEY,
                    language: 'vi-VN',
                },
            }),
        );

        const noteableActors = actorsData.data.cast.slice(0, 5).map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            profile: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null,
        }));

        return {
            ...data,
            noteableActors,
            release_date: data.release_date ? new Date(data.release_date).toLocaleDateString('vi-VN') : null,
            poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
            backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : null,
        };
    }
}
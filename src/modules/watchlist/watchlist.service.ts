import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Watchlist } from 'src/models';
import { MovieService } from '../movie/movie.service';
import { FilterWatchlistDto } from './dto/filter-watchlist.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WatchlistService {
    constructor(
        @InjectModel(Watchlist) private watchlistModel: typeof Watchlist,
        private movieService: MovieService,
        private readonly configService: ConfigService,
    ) {}

    async toggle(userId: number, movieId: number) {
        const item = await this.watchlistModel.findOne({
            where: { userId, movieId }
        });
        if (item) {
            await item.destroy();
            return { message: 'Đã xóa khỏi danh sách yêu thích', added: false };
        }

        await this.watchlistModel.create({ userId, movieId });
        return { message: 'Đã thêm vào danh sách yêu thích', added: true };
    }

    async getWatchListByUser(userId: number, dto: FilterWatchlistDto) {
        const {page, limit, sortBy, sortOrder} = dto;

        const limitPage = Number(limit || this.configService.get<number>('LIMIT'));
        const currentPage = Number(page || this.configService.get<number>('PAGE'));
        const offset = (currentPage - 1) * limitPage;

        let orderClause: any[] = [];
        
        if(sortBy && sortOrder) {
            orderClause = [[sortBy, sortOrder]];
        } else {
            orderClause = [['createdAt', 'DESC']];
        }
        
        const { rows, count } = await this.watchlistModel.findAndCountAll({
            where: { userId },
            attributes: ['movieId'],
            raw: true,
            order: orderClause,
            limit: limitPage,
            offset: offset,
        });
        const totalItems = Array.isArray(count) ? count.length : count;

        const movieIds = rows.map(i => i.movieId);
        const movies = await Promise.all(movieIds.map(async id => await this.movieService.getMovieDetails(id)));

        const cleanMovies = movies.map(m => ({
            id: m.id,
            title: m.title,
            poster: m.poster,
            releaseDate: m.release_date,  
            rating: m.vote_average.toFixed(1),
        }));
        const paginationMeta =  {
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limitPage),
                currentPage: currentPage,
                limitPage: limitPage,
        }

        return {
            items: cleanMovies,
            pagination: paginationMeta
        }
    }
}

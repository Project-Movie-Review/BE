import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Watchlist } from 'src/models';
import { MovieModule } from '../movie/movie.module';

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService],
  imports: [SequelizeModule.forFeature([Watchlist]), MovieModule],
})
export class WatchlistModule {}

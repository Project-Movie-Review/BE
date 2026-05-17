import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { ToggleWatchlistDto } from './dto/toggle-watchlist.dto';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { FilterWatchlistDto } from './dto/filter-watchlist.dto';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('toggle')
  @UseGuards(JwtGuard)
  async toggleWatchlist(@Body() dto: ToggleWatchlistDto, @Req() req: any) {
    const userId = req.user.id;
    const movieId = dto.movieId;
    return this.watchlistService.toggle(userId, movieId);
  }

  @Get('user')
  @UseGuards(JwtGuard)
  async getWatchList(@Req() req: any, @Query() dto: FilterWatchlistDto) {
    const userId = req.user.id;
    return this.watchlistService.getWatchListByUser(userId, dto);
  }

  @Get('user/:id')
  //@UseGuards(JwtGuard)
  async getWatchListByUserId(@Param('id') userId: number, @Query() dto: FilterWatchlistDto) {
    return this.watchlistService.getWatchListByUser(userId, dto);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { SearchMovieDto } from './dto/movie-search.dto';
import { FilterMovieDto } from './dto/movie-filter.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('trending')
  async getTrendingMovies() {
    return this.movieService.getTrendingMovies();
  }

  @Get('search')
  async searchMovies(@Query() searchMovieDto: SearchMovieDto) {
      return this.movieService.searchMovies(searchMovieDto);
  }

  @Get('filter')
  async filterMovies(@Query() filterMovieDto: FilterMovieDto) {
      return this.movieService.filterMovies(filterMovieDto);
  }

  @Get(':id')
  async getMovieDetails(@Param('id') id: number) {
    return this.movieService.getMovieDetails(id);
  }
}

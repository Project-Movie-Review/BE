import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [HttpModule],
  exports: [MovieService],
})
export class MovieModule {}

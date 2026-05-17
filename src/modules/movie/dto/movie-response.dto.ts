import { Expose, Transform } from 'class-transformer';

const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export class MovieListResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  // @Expose()
  // overview: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.poster_path ? BASE_IMAGE_URL + obj.poster_path : null
  )
  poster: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.backdrop_path ? BASE_IMAGE_URL + obj.backdrop_path : null
  )
  backdrop: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.release_date
      ? new Date(obj.release_date).toLocaleDateString('vi-VN')
      : null
  )
  releaseDate: string;

  @Expose()
  overview: string;

  @Expose({ name: 'vote_average' })
  rating: number;

  @Expose({ name: 'vote_count' })
  voteCount: number;

  @Expose()
  popularity: number;
}
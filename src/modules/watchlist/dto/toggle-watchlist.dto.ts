import { NumberRequired } from 'src/common/decorators';

export class ToggleWatchlistDto {
    @NumberRequired('Mã phim')
    movieId: number;
}
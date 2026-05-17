import { NumberNotRequired, StringNotRequired} from 'src/common/decorators';

export class SearchMovieDto {
    @StringNotRequired()
    query?: string;

    @NumberNotRequired()
    page?: number;

    @NumberNotRequired()
    limit?: number;
}
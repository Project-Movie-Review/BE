import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { ArrayNotRequired, NumberNotRequired, StringNotRequired } from "src/common/decorators";

export enum MovieSortBy {
  RELEASE_DATE = 'release_date',
  RATING = 'vote_average',
  POPULARITY = 'popularity',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterMovieDto {
    @NumberNotRequired()
    minRating?: number;

    @NumberNotRequired()
    maxRating?: number;

    @StringNotRequired()
    minReleaseDate?: string;

    @StringNotRequired()
    maxReleaseDate?: string;

    @NumberNotRequired()
    page?: number;

    @NumberNotRequired()
    limit?: number;

    @StringNotRequired()
    @IsEnum(MovieSortBy)
    sortBy?: MovieSortBy;

    @StringNotRequired()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @StringNotRequired()
    keyword?: string;
}
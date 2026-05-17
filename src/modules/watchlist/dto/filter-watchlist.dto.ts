import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export class FilterWatchlistDto {
    @NumberNotRequired()
    page?: number;

    @NumberNotRequired()
    limit?: number;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: string;
}
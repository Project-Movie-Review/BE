import { NumberNotRequired, StringNotRequired } from "src/common/decorators";

export enum Sentiment {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    NEUTRAL = 'neutral'
}

export class FilterReviewDto {
    @NumberNotRequired()
    page?: number;

    @NumberNotRequired()
    limit?: number;

    @StringNotRequired()
    sortBy?: string;

    @StringNotRequired()
    sortOrder?: string;
}
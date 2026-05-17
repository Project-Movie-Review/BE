import { Length, Max, Min } from "class-validator";
import { NumberRequired, StringRequired } from "src/common/decorators";

export class CreateReviewDto {
    @NumberRequired('movieId')
    movieId: number;

    @StringRequired('Nội dung bình luận')
    @Length(10, 1000, { message: 'Nội dung bình luận phải từ 10 đến 1000 ký tự' })
    content: string;

    @NumberRequired('rating')
    @Min(1, { message: 'Đánh giá phải từ 1 đến 10' })
    @Max(10, { message: 'Đánh giá phải từ 1 đến 10' })
    rating: number;
}
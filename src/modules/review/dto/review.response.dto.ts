import { Expose, Transform } from "class-transformer";

export class ReviewResponseDto {
    @Expose()
    author: string;

    @Expose()
    content: string;

    @Expose()
    rating: number | null;

    @Expose()
    @Transform(({ obj }) => {
        // Lấy giá trị thời gian từ một trong hai nguồn
        const dateValue = obj.createdAt || obj.created_at;
        
        if (!dateValue) return null;

        const date = new Date(dateValue);
        // Kiểm tra xem date có hợp lệ không trước khi format
        return isNaN(date.getTime()) 
            ? dateValue 
            : date.toLocaleDateString('vi-VN');
    })
    createdAt: string;

    @Expose()
    source: 'local' | 'tmdb'; // Để frontend biết review này từ đâu

    @Expose()
    avatar?: string;

    @Expose()
    sentiment?: string; 
}
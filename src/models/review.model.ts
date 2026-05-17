import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Review extends Model<Review> {
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    rating: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    movieId: number; // ID phim lấy từ TMDB API

    @Column({
        type: DataType.STRING,
        allowNull: true, // Sẽ được cập nhật sau khi qua module AI Sentiment
    })
    sentiment: string;

    // Thiết lập Khóa ngoại
    @ForeignKey(() => User)
    @Column
    userId: number;

    // Thiết lập Quan hệ: Một Review thuộc về một User
    @BelongsTo(() => User)
    user: User;
}
import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Watchlist extends Model<Watchlist> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    movieId: number; // ID phim từ TMDB

    @BelongsTo(() => User)
    user: User;
}
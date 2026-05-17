import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Review } from './review.model';
import { Watchlist } from './watchlist.model';

export enum UserRoles {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

@Table
export class User extends Model<User> {
    @Column({
        allowNull: false, 
        unique: true,
        type: DataType.STRING
    })
    email: string;
    
    @Column({
        allowNull: false, 
        type: DataType.STRING
    })
    username: string;

    @Column({
        allowNull: false, 
        type: DataType.STRING
    })
    password: string;

    @Column({
        allowNull: true,
        type: DataType.STRING
    })
    avatar: string;

    @Column({
        allowNull: true,
        type: DataType.ENUM(...Object.values(UserRoles)),
        defaultValue: UserRoles.USER
    })
    role: UserRoles;

    // Methods
    comparePassword(password: string) {
        const {password: passwordInDb} = this.get( {plain: true})
        return bcrypt.compare(password, passwordInDb);
    }

    // Relations
    @HasMany(() => Review)
    reviews: Review[];

    @HasMany(() => Watchlist)
    watchlists: Watchlist[];
}
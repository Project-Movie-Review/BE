import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRoles } from 'src/models';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { Helper } from 'src/utils/helper';

@Injectable()
export class UserService {
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ where: { email } });
    }

    async findById(id: number) {
        const user = await this.userModel.findByPk(id, {
            attributes: { exclude: ['password'] },
            raw: true
        });
        if (user) {
            return {
                ...user,
                avatar: Helper.getImageUrl(user.avatar)
            }
        } else {
            throw new BadRequestException('Người dùng không tồn tại');
        }
    }

    async findAll(dto: FilterUserDto) {
        const {
            search,
            role,
            page,
            limit,
            sortBy,
            sortOrder
        } = dto;

        const whereClause: any = {};
        if (search != undefined) {
            whereClause[Op.or] = [
                { username: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role != undefined) {
            whereClause.role = role;
        }

        const limitPage = Number(limit || this.configService.get<number>('LIMIT'));
        const currentPage = Number(page || this.configService.get<number>('PAGE'));
        const offset = (currentPage - 1) * limitPage;

        let orderClause: any[] = [];
        if (sortBy && sortOrder) {
            orderClause = [[sortBy, sortOrder]];
        } else {
            orderClause = [['createdAt', 'DESC']];
        }


        const { rows, count } = await this.userModel.findAndCountAll({
            raw: true,
            where: whereClause,
            order: orderClause,
            limit: limitPage,
            offset
        });

        const totalItems = Array.isArray(count) ? count.length : count;

        return {
            items: rows,
            paginationMeta: {
                totalItems,
                currentPage,
                limit: limitPage,
                totalPages: Math.ceil(totalItems / limitPage),
            }
        }
    }

    async createUser(userData: CreateUserDto) {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const user = await this.userModel.create(userData);
        const { password, ...result } = user.get({ plain: true });
        return {
            message: 'Đăng ký thành công',
            data: result
        }
    }

    async validate(email: string, password: string) {
        const user = await this.findByEmail(email);
        if (!user) {
            return null;
        }
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return user;
        }
        return null;
    }

    async updateUser(id: number, updateData: UpdateUserDto) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        if (updateData.newPassword) {
            if (updateData.oldPassword) {
                const passwordValid = await user.comparePassword(updateData.oldPassword);
                if (!passwordValid) {
                    throw new BadRequestException('Mật khẩu cũ không đúng');
                }
                updateData.newPassword = await bcrypt.hash(updateData.newPassword, 10);
            } else {
                throw new BadRequestException('Vui lòng cung cấp mật khẩu cũ để đổi mật khẩu mới');
            }
        }

        if (updateData.avatar) {
            user.avatar = updateData.avatar;
        }

        await user.update(updateData);
        const { password, ...result } = user.get({ plain: true });
        return {
            message: 'Cập nhật thông tin thành công',
            data: {
                ...result,
                avatar: Helper.getImageUrl(result.avatar)
            }
        };
    }

    async deleteUser(id: number) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }
        await this.userModel.destroy({ where: { id }, cascade: true });
        return { message: 'Xóa người dùng thành công' };
    }
}

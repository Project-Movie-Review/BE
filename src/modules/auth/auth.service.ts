import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async login(user: any) {
        const plainUser = user.get({ plain: true });
        const payload = {
            id: plainUser.id,
            email: plainUser.email,
            role: plainUser.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            message: 'Đăng nhập thành công',
            accessToken
        }
    }
}

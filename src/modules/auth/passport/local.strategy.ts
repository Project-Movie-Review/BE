import { Strategy} from 'passport-local';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            usernameField: 'email', // trường dùng làm username, mặc định là 'username'
        });
    }

    async validate(email: string, password: string) { 
        const user = await this.userService.validate(email, password);
        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chinh xác');
        }
        return user;
    }
}
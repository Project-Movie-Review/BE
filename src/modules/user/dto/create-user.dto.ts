import { IsEmail, MinLength } from "class-validator";
import { StringRequired } from "src/common/decorators";

export class CreateUserDto {
    @StringRequired('Email')
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @StringRequired('Tên đăng nhập')
    username: string;

    @StringRequired('Mật khẩu')
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}
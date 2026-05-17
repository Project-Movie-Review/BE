import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    oldPassword?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    newPassword?: string;
}
import { applyDecorators, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";


export const StringRequired = (name: string) => applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty({ message: `${name} không được bỏ trống` }),
    IsString({ message: `${name} phải là chuỗi` }),
)

export const DateRequired = (name: string) => applyDecorators(
    ApiProperty({ required: true }),
    Type(() => Date),
    IsNotEmpty({ message: `${name} không được bỏ trống` }),
    IsDate({ message: `${name} phải có dạng YYY-MM-DD` }),
)

export const NumberRequired = (name: string, min: number = 0, max?: number) => applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty({ message: `${name} không được bỏ trống` }),
    IsNumber({}, { message: `${name} phải là số` }),
    Min(min),
    ...(max ? [Max(max)] : []),
)

export const EnumRequired = (enumType: any, name: string) => applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty({ message: `${name} không được bỏ trống` }),
    IsEnum(enumType)
)

export const ArrayNotRequired = (type: any) => applyDecorators(
    ApiProperty({ required: false }),
    IsOptional(),
    IsArray(),
    Type(() => type)
)

export const ArrayRequired = (type: any) => applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty(),
    IsArray(),
    Type(() => type)
)

export const BooleanNotRequired = () => applyDecorators(
    ApiProperty({ required: false }),
    IsOptional(),
    IsBoolean()
)

export const NumberNotRequired = () => applyDecorators(
    ApiProperty({ required: false }),
    IsOptional(),
    IsNumber()
)

export const StringNotRequired = () => applyDecorators(
    ApiProperty({ required: false }),
    IsOptional(),
    IsString()
)

export const DateNotRequired = () => applyDecorators(
    ApiProperty({ required: false }),
    Type(() => Date),
    IsDate(),
    IsOptional()
)

export const ArrayEnumRequired = (enumType: any, name: string) => applyDecorators(
    ApiProperty({ required: true }),
    IsNotEmpty({ message: `${name} không được bỏ trống` }),
    IsArray({ message: `${name} phải là một mảng` }),
    IsEnum(enumType, { each: true, message: `${name} chỉ được chứa các giá trị hợp lệ` })
);




export const CurrentInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
) 
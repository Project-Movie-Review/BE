import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        if(err) {
            throw new UnauthorizedException("Bạn không có quyền truy cập");
        }

        if(!user) {
            if(info?.name === 'JsonWebTokenError') throw new UnauthorizedException('Token không hợp lệ.');
            else if(info?.name === 'TokenExpiredError') throw new UnauthorizedException('Token hết hạn.');
            else throw new UnauthorizedException('Bạn không có quyền truy cập')
        }

        return user;
    }
}
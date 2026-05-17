import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';
import Helper from '../../utils/helper';


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    private getDefaultMessage(method: string): string {
        switch (method){
            case 'POST':
                return 'Tạo mới thành công';
            case 'PATCH':
                return 'Cập nhật thành công';
            case 'DELETE':
                return 'Xóa thành công';
            case 'GET':
                return 'Lấy dữ liệu thành công';
            default:
                return 'Yêu cầu đã hoàn thành';
        }
    }

    private toPlainObject(data: any): any {
        if(data && typeof data.get === 'function') {
            return data.get({ plain: true});
        }

        if(Array.isArray(data)) {
            return data.map(item => (item && typeof item.get === 'function' ? item.get({ plain: true }) : item));
        }
        return data;
    }

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>>  {
        const request = context.switchToHttp().getRequest();
        const startTime = Number(request['startTime']);
        const endTime = Date.now();
        const statusCode = context.switchToHttp().getResponse().statusCode
        const takenTime = `${endTime - startTime}ms`;
        return next.handle().pipe(map((data: any) => {
            if(data && typeof data === 'object' && 'success' in data && 'message' in data) {
                return data as ApiResponse<T>;
            }

            let finalMessage = this.getDefaultMessage(request.method);

            if(data && typeof data === 'object' && 'message' in data) {
                finalMessage = data.message as string;
                const {message, ...rest} = data;
                data = Object.keys(rest).length > 0 ? rest : undefined;

                if(!data) {
                    data = undefined as unknown as T;
                }
            } 

            if(data && typeof data === 'object' && 'data' in data) {
                data = data.data as T;
            } 

            const plainData = this.toPlainObject(data);

            return {
                success: true,
                statusCode,
                message: finalMessage,
                data: Helper.formatDates(plainData),
                date: new Date().toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                    hour12: false
                }),
                path: request.url,
                takenTime,
            }
        }))  
    }
}
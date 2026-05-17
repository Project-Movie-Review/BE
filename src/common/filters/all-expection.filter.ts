import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const startTime = Number(request['startTime']);
    const endTime = Date.now();
    const takenTime = `${endTime - startTime}ms`;
    
    let status: number;
    let message: string = 'Có lỗi xảy ra';
    let error: any;

    // Khi lỗi có chủ đích (lỗi Http)
    if(exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if(typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if(typeof exceptionResponse === 'object') {
            const exceptionResponseObject = exceptionResponse as Record<string, any>;
            message = exceptionResponseObject.message || exceptionResponseObject.error || 'Có lỗi xảy ra';

            // Lỗi validate dto
            if(Array.isArray(exceptionResponseObject.message)) {
                message = 'Dữ liệu không hợp lệ';
                error = exceptionResponseObject.message;
            }
        } 
    } 

    // Lỗi ngoài ý muốn
    else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Hệ thống đang gặp sự cố';
        this.logger.error( exception)
    }

    const errResponse: ApiResponse<any> = {
        success: false,
        statusCode: status,
        message,
        ...(error && { error}),
        date: new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false
        }),
        path: request.url,
        takenTime,
    }

    response.status(status).json(errResponse);
  }
}
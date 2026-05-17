export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    date?: Date | string;
    path?: string;
    takenTime?: string;
}
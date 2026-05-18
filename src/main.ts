import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/all-expection.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const configService = new ConfigService();

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,  // xóa các field dư thừa trong payload
        forbidNonWhitelisted: true, // báo lỗi dư thừa field không cần thiết
        transform: true, // chuyển payload thành instance dto
        transformOptions: { enableImplicitConversion: true }, // cho phép transform dữ liệu của field
      }
    ));

  app.useGlobalInterceptors(new TransformInterceptor);
  app.useGlobalFilters(new AllExceptionFilter);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SAT-BE API')
    .setDescription('Build API for SAT Test Management')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  //CORS
  app.enableCors(
    {
      "origin": true,
      "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );

  const port = configService.get<string>('PORT') || 6700;

  logger.log(`Server starts on port ${port}`);
  logger.log(`Swagger running on http://localhost:${port}/api/v1/docs`);
  await app.listen(port);
}
bootstrap();

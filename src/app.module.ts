import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { StartTimingMiddleware } from './common/middlewares/start-timing.middleware';
import { JwtModule, } from '@nestjs/jwt';
import { sequelizeConfig } from './config/sequelize.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { MovieModule } from './modules/movie/movie.module';
import { SentimentModule } from './modules/sentiment/sentiment.module';
import { ReviewModule } from './modules/review/review.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    SequelizeModule.forRootAsync({ //custom
      inject: [ConfigService],
      useFactory: (configService: ConfigService): SequelizeModuleOptions =>
        sequelizeConfig(configService)
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_EXPIRES_IN'),
        },
      }),
      global: true,
    }),
    UserModule,
    AuthModule,
    ImageModule,
    MovieModule,
    SentimentModule,
    ReviewModule,
    WatchlistModule,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StartTimingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL});
  }
}


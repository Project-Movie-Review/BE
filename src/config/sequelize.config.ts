import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { Dialect } from "sequelize"
import { Review, User, Watchlist } from "src/models"

export const sequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => ({
    database: configService.get<string>('DB_NAME'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT') ? Number(configService.get<number>('DB_PORT')) : 3306,
    dialect: configService.get<Dialect>('DB_DIALECT') ?? 'mysql',
    synchronize: true,
    autoLoadModels: true,
    logging: false,
    dialectOptions: {},
    models: [
        User,
        Review,
        Watchlist,
    ]
})
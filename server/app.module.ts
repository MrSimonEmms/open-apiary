/**
 * app.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

/* Files */
import config from './config/env';
import ApiaryModule from './apiary/apiary.module';
import AuthModule from './auth/auth.module';
import MediaModule from './media/media.module';
import NuxtModule from './nuxt/nuxt.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) : Promise<TypeOrmModuleOptions> => ({
        /* Types are given where we need to override type system */
        type: configService.get<any>('db.type', 'mysql'),
        host: configService.get('db.host', 'localhost'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get<any>('db.database'),
        migrationsRun: configService.get<boolean>('db.migrationsRun', true),
        synchronize: configService.get<boolean>('db.sync', false),
        logging: configService.get<LoggerOptions>('db.logging', false),
        name: 'default',
        entities: [
          `${__dirname}/**/*.entity{.ts,.js}`,
        ],
        migrations: [
          `${__dirname}/**/*.migration{.ts,.js}`,
        ],
      }),
    }),
    ApiaryModule,
    AuthModule,
    MediaModule,
    UserModule,
    NuxtModule, /* This must be last */
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}

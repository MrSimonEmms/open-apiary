/**
 * app.module
 */

/* Node modules */
import * as path from 'path';

/* Third-party modules */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { Logger as TypeOrmLogger } from 'typeorm';
import {
  TerminusModule,
  TerminusModuleOptions,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import {
  LoggerModule,
  Params,
  PinoLogger,
} from 'nestjs-pino';
import pino from 'pino';
import uuid from 'uuid';

/* Files */
import config from './config/env';
import ApiaryModule from './apiary/apiary.module';
import AuthModule from './auth/auth.module';
import LogModule from './log/log.module';
import MediaModule from './media/media.module';
import NuxtModule from './nuxt/nuxt.module';
import UserModule from './user/user.module';
import PinoTypeOrmLogger from './logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) : Promise<Params> => {
        let logDest = configService
          .get<string | number>('logging.destination', path.join(process.cwd(), 'log', 'open-apiary.log'));

        /* Log to STDOUT */
        if (logDest === 'STDOUT') { logDest = 1; }

        return {
          pinoHttp: [{
            name: 'open-apiary',
            level: configService.get('logging.level', 'info'),
            serializers: pino.stdSerializers,
            genReqId: () => uuid.v4(),
            customLogLevel: (res, err) => {
              if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn';
              }
              if (res.statusCode >= 500 || err) {
                return 'error';
              }

              return 'debug';
            },
          }, pino.destination(logDest)],
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, PinoLogger],
      useFactory: async (
        configService: ConfigService,
        pinoLogger: PinoLogger,
      ) : Promise<TypeOrmModuleOptions> => {
        let logger : 'debug' | TypeOrmLogger = 'debug';

        if (configService.get<LoggerOptions>('db.logging', false)) {
          logger = new PinoTypeOrmLogger(pinoLogger);
        }

        return {
          /* Types are given where we need to override type system */
          logger,
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
        };
      },
    }),
    TerminusModule.forRootAsync({
      inject: [TypeOrmHealthIndicator],
      useFactory: (db: TypeOrmHealthIndicator) : TerminusModuleOptions => ({
        endpoints: [{
          url: '/api/health',
          healthIndicators: [
            async () => db.pingCheck('database', {
              timeout: 300,
            }),
          ],
        }],
      }),
    }),
    ApiaryModule,
    AuthModule,
    LogModule,
    MediaModule,
    UserModule,
    NuxtModule, /* This must be last */
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}

/**
 * media.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Files */
import Media from './entities/media.entity';
import MediaController from './controller/media.controller';
import OutputController from './controller/output.controller';
import MediaService from './services/media.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('server.upload'),
      }),
    }),
    TypeOrmModule.forFeature([Media]),
  ],
  controllers: [
    MediaController,
    OutputController,
  ],
  providers: [MediaService],
})
export default class MediaModule {}

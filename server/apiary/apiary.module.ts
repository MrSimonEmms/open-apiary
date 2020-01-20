/**
 * apiary.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Files */
import Apiary from './entities/apiary.entity';
import ApiaryController from './controllers/apiary.controller';
import ApiaryService from './services/apiary.service';
import Hive from './entities/hive.entity';
import HiveController from './controllers/hive.controller';
import HiveService from './services/hive.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Hive,
    Apiary,
  ])],
  controllers: [
    HiveController,
    ApiaryController,
  ],
  providers: [
    HiveService,
    ApiaryService,
  ],
  exports: [
    HiveService,
    ApiaryService,
  ],
})
export default class ApiaryModule {}

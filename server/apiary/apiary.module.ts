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
import Inspection from './entities/inspection.entity';
import InspectionController from './controllers/inspection.controller';
import InspectionService from './services/inspection.service';
import UUIDController from './controllers/uuid.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Inspection,
    Hive,
    Apiary,
  ])],
  controllers: [
    InspectionController,
    UUIDController,
    HiveController,
    ApiaryController,
  ],
  providers: [
    InspectionService,
    HiveService,
    ApiaryService,
  ],
  exports: [
    InspectionService,
    HiveService,
    ApiaryService,
  ],
})
export default class ApiaryModule {}

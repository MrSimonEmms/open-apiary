/**
 * apiary.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Files */
import Apiary from './entities/apiary.entity';
import ApiaryService from './services/apiary.service';
import ApiaryController from './controllers/apiary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Apiary,
  ])],
  controllers: [ApiaryController],
  providers: [ApiaryService],
  exports: [ApiaryService],
})
export default class ApiaryModule {}

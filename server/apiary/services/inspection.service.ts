/**
 * inspection.service
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

/* Files */
import Inspection from '../entities/inspection.entity';

@Injectable()
export default class InspectionService extends TypeOrmCrudService<Inspection> {
  constructor(
    @InjectRepository(Inspection) protected repo,
  ) {
    super(repo);
  }
}

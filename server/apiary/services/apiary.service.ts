/**
 * apiary.service
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

/* Files */
import Apiary from '../entities/apiary.entity';

@Injectable()
export default class ApiaryService extends TypeOrmCrudService<Apiary> {
  constructor(
    @InjectRepository(Apiary) protected repo,
  ) {
    super(repo);
  }
}

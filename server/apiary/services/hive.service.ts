/**
 * hive.service
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

/* Files */
import Hive from '../entities/hive.entity';

@Injectable()
export default class HiveService extends TypeOrmCrudService<Hive> {
  constructor(
    @InjectRepository(Hive) protected repo,
  ) {
    super(repo);
  }

  async findHivesByApiaryId(apiary: number) {
    return this.find({
      where: {
        apiary,
      },
    });
  }
}

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

  async findByApiaryCountAndApiaryId(
    apiaryCount: number,
    apiary: number,
  ) : Promise<Hive | undefined> {
    return this.findOne({
      where: {
        apiaryCount,
        apiary,
      },
    });
  }

  async findHivesByApiaryId(apiary: number) : Promise<Hive[]> {
    return this.find({
      where: {
        apiary,
      },
    });
  }

  async findNextHiveNumber(apiary: number) : Promise<number> {
    const hive = await this.findOne({
      where: {
        apiary,
      },
      order: {
        apiaryCount: 'DESC',
      },
    });

    if (!hive) {
      return 1;
    }

    return hive.apiaryCount + 1;
  }
}

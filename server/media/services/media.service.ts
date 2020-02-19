/**
 * media.service
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/* Files */
import Media from '../entities/media.entity';

@Injectable()
export default class UserService extends TypeOrmCrudService<Media> {
  constructor(
    @InjectRepository(Media) protected repo,
  ) {
    super(repo);
  }
}

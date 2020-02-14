/**
 * uuid.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/* Files */
import HiveService from '../services/hive.service';

@UseGuards(AuthGuard('jwt'))
@Controller('/api/hive/uuid')
export default class UUIDController {
  constructor(protected readonly hiveService: HiveService) {}

  @Get('/:uuid')
  async getByUUID(@Param('uuid') uuid: string) {
    const hive = await this.hiveService.findHiveByUUID(uuid);

    if (!hive) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return hive;
  }
}

/**
 * hive.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

/* Files */
import Hive from '../entities/hive.entity';
import HiveService from '../services/hive.service';
import { IApiary } from '../interfaces/apiary';
import ApiaryService from '../services/apiary.service';

@Crud({
  model: {
    type: Hive,
  },
  params: {
    apiaryId: {
      field: 'apiaryId',
      type: 'number',
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'updateOneBase',
    ],
  },
})
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller('/api/apiary/:apiaryId/hive')
export default class HiveController implements CrudController<Hive> {
  constructor(public service: HiveService, protected apiaryService: ApiaryService) {}

  get base(): CrudController<Hive> {
    return this;
  }

  @Override()
  async createOne(@Param('apiaryId') id: string, @ParsedRequest() req: CrudRequest, @ParsedBody() dto: Hive) {
    const apiaryId = Number(id);

    if (dto.apiaryCount) {
      const hive = await this.service.findByApiaryCountAndApiaryId(dto.apiaryCount, apiaryId);

      if (hive) {
        throw new HttpException('APIARY_COUNT_MUST_BE_UNIQUE', HttpStatus.BAD_REQUEST);
      }
    } else {
      /* Auto-generate the apiary count */
      dto.apiaryCount = await this.service.findNextHiveNumber(apiaryId);
    }

    /* Set the apiary ID */
    (<Partial<IApiary>> dto.apiary) = {
      id: apiaryId,
    };

    return this.base.createOneBase(req, dto);
  }

  @Override()
  async replaceOne(@Param('id') id: string,
    @Param('apiaryId') apiaryId: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Hive) {
    const originalHive = await this.service.findOne({
      id: Number(id),
    });

    const apiaryInt = Number(apiaryId);

    if (dto.apiaryCount) {
      const hive = await this.service.findByApiaryCountAndApiaryId(
        dto.apiaryCount,
        apiaryInt,
      );

      if (hive && hive.id !== Number(id)) {
        throw new HttpException('APIARY_COUNT_MUST_BE_UNIQUE', HttpStatus.BAD_REQUEST);
      }
    }

    /* Check the apiaryId is valid if already set */
    if (originalHive?.apiary && originalHive.apiary.id !== apiaryInt) {
      throw new HttpException('UNKNOWN_APIARY', HttpStatus.BAD_REQUEST);
    }

    const apiary = await this.apiaryService.findOne({
      id: apiaryInt,
    });

    if (!apiary) {
      throw new HttpException('UNKNOWN_APIARY', HttpStatus.NOT_FOUND);
    }

    /* Set the apiary */
    dto.apiary = apiary;

    return this.base.replaceOneBase(req, dto);
  }
}

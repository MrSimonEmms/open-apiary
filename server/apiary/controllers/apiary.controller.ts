/**
 * apiary.controller
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
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';

/* Files */
import Apiary from '../entities/apiary.entity';
import ApiaryService from '../services/apiary.service';
import HiveService from '../services/hive.service';

@Crud({
  model: {
    type: Apiary,
  },
  routes: {
    exclude: [
      'createManyBase',
      'updateOneBase',
    ],
  },
  query: {
    join: {
      hives: {
        eager: true,
      },
      location: {
        eager: true,
        required: true,
      },
    },
  },
})
@UseGuards(AuthGuard('jwt'))
@Controller('/api/apiary')
export default class ApiaryController implements CrudController<Apiary> {
  constructor(
    public service: ApiaryService,
    protected hiveService: HiveService,
  ) {}

  get base(): CrudController<Apiary> {
    return this;
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Param('id') id: string) {
    const hives = await this.hiveService.findHivesByApiaryId(Number(id));

    if (hives.length > 0) {
      /* Hives still present - disallow the request */
      throw new HttpException('DELETE_ALL_HIVES_FIRST', HttpStatus.BAD_REQUEST);
    }

    return this.base.deleteOneBase(req);
  }
}

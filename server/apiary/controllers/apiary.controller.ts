/**
 * apiary.controller
 */

/* Node modules */

/* Third-party modules */
import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

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
      'hives.inspections': {
        eager: true,
      },
      location: {
        eager: true,
        required: true,
      },
      image: {
        allow: ['id'],
        eager: true,
      },
    },
  },
})
@ApiBearerAuth('jwt')
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

  @CacheTTL(10 * 60) // OpenWeather API has a 10 minute cache
  @UseInterceptors(CrudRequestInterceptor, CacheInterceptor)
  @Get('/:id/weather')
  async getCurrentWeather(@ParsedRequest() req: CrudRequest) {
    const apiary = await this.service.getOne(req);

    return this.service.getWeather(apiary.location.latitude, apiary.location.longitude);
  }
}

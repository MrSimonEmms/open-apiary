/**
 * hive.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller, UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';

/* Files */
import Hive from '../entities/hive.entity';
import HiveService from '../services/hive.service';

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
@UseGuards(AuthGuard('jwt'))
@Controller('/api/apiary/:apiaryId/hive')
export default class HiveController implements CrudController<Hive> {
  constructor(public service: HiveService) {}
}

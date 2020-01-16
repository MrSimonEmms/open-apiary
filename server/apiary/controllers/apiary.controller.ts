/**
 * apiary.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';

/* Files */
import Apiary from '../entities/apiary.entity';
import ApiaryService from '../services/apiary.service';

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
})
@UseGuards(AuthGuard('jwt'))
@Controller('/api/apiary')
export default class ApiaryController implements CrudController<Apiary> {
  constructor(public service: ApiaryService) {}
}

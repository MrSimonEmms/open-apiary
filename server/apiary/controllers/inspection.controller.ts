/**
 * inspection.controller
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
import Inspection from '../entities/inspection.entity';
import InspectionService from '../services/inspection.service';

@Crud({
  model: {
    type: Inspection,
  },
  params: {
    apiary: {
      disabled: true,
    },
    hive: {
      field: 'hive',
      type: 'number',
    },
  },
  routes: {
    exclude: [
      'createManyBase',
      'updateOneBase',
    ],
  },
  query: {
    join: {
      queen: {
        eager: true,
        required: true,
      },
      queenCell: {
        eager: true,
        required: true,
      },
      brood: {
        eager: true,
        required: true,
      },
      feed: {
        eager: true,
        required: true,
      },
      health: {
        eager: true,
        required: true,
      },
      weather: {
        eager: true,
        required: true,
      },
    },
  },
})
@UseGuards(AuthGuard('jwt'))
@Controller('/api/apiary/:apiary/hive/:hive/inspection')
export default class InspectionController implements CrudController<Inspection> {
  constructor(public service: InspectionService) {}
}

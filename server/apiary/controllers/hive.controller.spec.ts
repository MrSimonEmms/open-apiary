/**
 * hive.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';

/* Files */
import HiveController from './hive.controller';
import HiveService from '../services/hive.service';
import Hive from '../entities/hive.entity';

describe('Hive controller', function () {
  let controller: HiveController;

  beforeEach(async () => {
    this.mockHiveService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiveController],
      providers: [{
        provide: HiveService,
        useValue: this.mockHiveService,
      }],
    }).compile();

    controller = module.get<HiveController>(HiveController);

    expect(Reflect.getMetadata('path', HiveController)).toBe('/api/apiary/:apiaryId/hive');

    const guards = Reflect.getMetadata('__mockedGuards__', HiveController);
    expect(guards).toHaveLength(1);
    expect(guards[0]()).toEqual([
      'jwt',
    ]);

    expect(Reflect.getMetadata('__mockedCrud__', HiveController)).toEqual([{
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
    }]);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

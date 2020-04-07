/**
 * hive.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

/* Files */
import HiveController from './hive.controller';
import HiveService from '../services/hive.service';
import Hive from '../entities/hive.entity';
import ApiaryService from '../services/apiary.service';

describe('Hive controller', function () {
  let controller: HiveController;

  beforeEach(async () => {
    this.mockHiveService = {
      findByApiaryCountAndApiaryId: jest.fn(),
      findNextHiveNumber: jest.fn(),
    };

    this.mockApiaryService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiveController],
      providers: [{
        provide: HiveService,
        useValue: this.mockHiveService,
      }, {
        provide: ApiaryService,
        useValue: this.mockApiaryService,
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

  describe('#createOne', () => {
    it('should throw a 400 error if duplicate apiaryCount is given', async () => {
      this.mockHiveService.findByApiaryCountAndApiaryId.mockResolvedValue(true);

      const apiaryId = '2';
      const req : any = {};
      const dto : any = {
        apiaryCount: 1,
      };

      try {
        await controller.createOne(apiaryId, req, dto);

        throw new Error('invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);

        expect(this.mockHiveService.findByApiaryCountAndApiaryId)
          .toBeCalledWith(dto.apiaryCount, Number(apiaryId));
        expect(HttpException).toBeCalledWith('APIARY_COUNT_MUST_BE_UNIQUE', HttpStatus.BAD_REQUEST);
      }
    });

    it('should set the apiaryCount if given and is not already in use', async () => {
      this.mockHiveService.findByApiaryCountAndApiaryId.mockResolvedValue(undefined);
      const res = {
        result: true,
      };
      (<any> controller).createOneBase = jest.fn()
        .mockResolvedValue(res);

      const apiaryId = '230';
      const req : any = {};
      const dto : any = {
        apiaryCount: 120,
      };

      expect(await controller.createOne(apiaryId, req, dto)).toEqual(res);

      expect(this.mockHiveService.findByApiaryCountAndApiaryId)
        .toBeCalledWith(dto.apiaryCount, Number(apiaryId));

      expect((<any> controller).createOneBase).toBeCalledWith(req, {
        apiaryCount: dto.apiaryCount,
        apiary: {
          id: Number(apiaryId),
        },
      });
    });

    it('should generate the apiaryCount if not given', async () => {
      const apiaryCount = 2233;
      this.mockHiveService.findNextHiveNumber.mockResolvedValue(apiaryCount);
      this.mockHiveService.findByApiaryCountAndApiaryId.mockResolvedValue(undefined);
      const res = {
        result: true,
      };
      (<any> controller).createOneBase = jest.fn()
        .mockResolvedValue(res);

      const apiaryId = '231';
      const req : any = {};
      const dto : any = {};

      expect(await controller.createOne(apiaryId, req, dto)).toEqual(res);

      expect(this.mockHiveService.findByApiaryCountAndApiaryId)
        .not.toBeCalled();

      expect(this.mockHiveService.findNextHiveNumber).toBeCalledWith(Number(apiaryId));

      expect((<any> controller).createOneBase).toBeCalledWith(req, {
        apiaryCount,
        apiary: {
          id: Number(apiaryId),
        },
      });
    });
  });

  describe('#replaceOne', () => {

  });
});

/**
 * apiary.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

/* Files */
import ApiaryController from './apiary.controller';
import ApiaryService from '../services/apiary.service';
import HiveService from '../services/hive.service';
import Apiary from '../entities/apiary.entity';

describe('Apiary Controller', function () {
  let controller: ApiaryController;

  beforeEach(async () => {
    this.mockApiaryService = {
      findByEmailAndPassword: jest.fn(),
      generateUserToken: jest.fn(),
      toDTO: jest.fn(),
    };

    this.mockHiveService = {
      findHivesByApiaryId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiaryController],
      providers: [{
        provide: ApiaryService,
        useValue: this.mockApiaryService,
      }, {
        provide: HiveService,
        useValue: this.mockHiveService,
      }],
    }).compile();

    controller = module.get<ApiaryController>(ApiaryController);

    expect(Reflect.getMetadata('path', ApiaryController)).toBe('/api/apiary');

    const guards = Reflect.getMetadata('__mockedGuards__', ApiaryController);
    expect(guards).toHaveLength(1);
    expect(guards[0]()).toEqual([
      'jwt',
    ]);

    expect(Reflect.getMetadata('__mockedCrud__', ApiaryController)).toEqual([{
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
        },
      },
    }]);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#delete', () => {
    it('should prevent deletion of apiaries with hives', async () => {
      this.mockHiveService.findHivesByApiaryId.mockResolvedValue(['']);

      const request : any = 'some-request';
      const id = '123';

      try {
        await controller.deleteOne(request, id);

        throw new Error('Invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);

        expect(this.mockHiveService.findHivesByApiaryId).toBeCalledWith(Number(id));
        expect(HttpException).toBeCalledWith('DELETE_ALL_HIVES_FIRST', HttpStatus.BAD_REQUEST);
      }
    });

    it('should allow deletion of apiaries without hives', async () => {
      this.mockHiveService.findHivesByApiaryId.mockResolvedValue([]);

      const deleteOneBase = jest.fn();
      (<any> controller).deleteOneBase = deleteOneBase;

      const request : any = 'some-request';
      const id = '12';

      await controller.deleteOne(request, id);

      expect(this.mockHiveService.findHivesByApiaryId).toBeCalledWith(Number(id));

      expect(deleteOneBase).toBeCalledWith(request);
    });
  });
});

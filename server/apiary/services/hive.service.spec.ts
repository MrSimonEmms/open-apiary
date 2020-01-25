/**
 * hive.service.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

/* Files */
import HiveService from './hive.service';
import Hive from '../entities/hive.entity';

describe('HiveService', function () {
  let service: HiveService;

  beforeEach(async () => {
    this.hiveRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      metadata: {
        columns: [],
        relations: [],
        connection: {
          options: {
            type: '',
          },
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: getRepositoryToken(Hive),
        useValue: this.hiveRepo,
      }, HiveService],
    }).compile();

    service = module.get<HiveService>(HiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect((<any> service).repo).toBe(this.hiveRepo);
  });

  describe('#findByApiaryCountAndApiaryId', () => {
    it('should query by apiaryCount and apiaryId', async () => {
      const res = {
        result: true,
      };
      this.hiveRepo.findOne.mockResolvedValue(res);

      const apiaryCount = 1;
      const apiary = 2;

      expect(await service.findByApiaryCountAndApiaryId(apiaryCount, apiary)).toBe(res);

      expect(this.hiveRepo.findOne).toBeCalledWith({
        where: {
          apiaryCount,
          apiary,
        },
      });
    });
  });

  describe('#findHivesByApiaryId', () => {
    it('should query by apiary', async () => {
      const res = [{
        result: true,
      }];
      this.hiveRepo.find.mockResolvedValue(res);

      const apiary = 2;

      expect(await service.findHivesByApiaryId(apiary)).toBe(res);

      expect(this.hiveRepo.find).toBeCalledWith({
        where: {
          apiary,
        },
      });
    });
  });

  describe('#findNextHiveNumber', () => {
    it('should get the next available hive number if no hives found', async () => {
      this.hiveRepo.findOne.mockResolvedValue(undefined);

      const apiary = 134;

      expect(await service.findNextHiveNumber(apiary)).toEqual(1);

      expect(this.hiveRepo.findOne).toBeCalledWith({
        where: {
          apiary,
        },
        order: {
          apiaryCount: 'DESC',
        },
      });
    });

    it('should get the next available hive number if a hive found', async () => {
      const apiaryCount = 12334;
      this.hiveRepo.findOne.mockResolvedValue({
        apiaryCount,
      });

      const apiary = 1342;

      expect(await service.findNextHiveNumber(apiary)).toEqual(apiaryCount + 1);

      expect(this.hiveRepo.findOne).toBeCalledWith({
        where: {
          apiary,
        },
        order: {
          apiaryCount: 'DESC',
        },
      });
    });
  });
});

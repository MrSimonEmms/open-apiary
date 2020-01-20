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
});

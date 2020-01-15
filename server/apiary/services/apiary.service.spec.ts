/**
 * apiary.service.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ApiaryService from './apiary.service';
import Apiary from '../entities/apiary.entity';

/* Files */

describe('ApiaryService', function () {
  let service: ApiaryService;

  beforeEach(async () => {
    // @todo see if there's a better way of stubbing a DB to CRUD Service
    this.apiaryRepo = {
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
        provide: getRepositoryToken(Apiary),
        useValue: this.apiaryRepo,
      }, ApiaryService],
    }).compile();

    service = module.get<ApiaryService>(ApiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect((<any> service).repo).toBe(this.apiaryRepo);
  });
});

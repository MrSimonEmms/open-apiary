/**
 * apiary.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';

/* Files */
import ApiaryController from './apiary.controller';
import ApiaryService from '../services/apiary.service';

describe('Apiary Controller', function () {
  let controller: ApiaryController;

  beforeEach(async () => {
    this.mockApiaryService = {
      findByEmailAndPassword: jest.fn(),
      generateUserToken: jest.fn(),
      toDTO: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiaryController],
      providers: [{
        provide: ApiaryService,
        useValue: this.mockApiaryService,
      }],
    }).compile();

    controller = module.get<ApiaryController>(ApiaryController);

    expect(Reflect.getMetadata('path', ApiaryController)).toBe('/api/apiary');

    const guards = Reflect.getMetadata('__mockedGuards__', ApiaryController);
    expect(guards).toHaveLength(1);
    expect(guards[0]()).toEqual([
      'jwt',
    ]);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

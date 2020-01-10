/**
 * nuxt.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';

/* Files */
import NuxtController from './nuxt.controller';

describe('Nuxt Controller', () => {
  let controller: NuxtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NuxtController],
    }).compile();

    controller = module.get<NuxtController>(NuxtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

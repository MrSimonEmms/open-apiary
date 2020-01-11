/**
 * nuxt.controller.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { Builder, Nuxt } from 'nuxt';

/* Files */
import NuxtController from './nuxt.controller';
import config from '../../nuxt.config';

describe('Nuxt Controller', () => {
  let controller: NuxtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NuxtController],
    }).compile();

    controller = module.get<NuxtController>(NuxtController);
  });

  describe('#constructor', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...OLD_ENV,
      };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('should create a nuxt dev instance if IS_NUXT_ENABLED', async () => {
      process.env.IS_NUXT_ENABLED = '1';
      const obj = new NuxtController();

      expect((<any> obj).nuxt).toBeDefined();
      expect(Nuxt).toBeCalledWith(config);

      // This is fairly horrible, but I have to put an async/await in a constructor
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(Builder).toBeCalledWith((<any> obj).nuxt);

      delete process.env.IS_NUXT_ENABLED;
    });

    it('should create a nuxt prod instance if IS_NUXT_DISABLED not true', () => {
      const obj = new NuxtController();

      const customConfig = {
        ...config,
        dev: false,
        buildModules: [],
      };

      expect((<any> obj).nuxt).toBeDefined();
      expect(Nuxt).toBeCalledWith(customConfig);
    });

    it('should do nothing if IS_NUXT_DISABLED is true', () => {
      process.env.IS_NUXT_DISABLED = 'true';
      const obj = new NuxtController();

      expect((<any> obj).nuxt).toBeUndefined();

      delete process.env.IS_NUXT_ENABLED;
    });
  });

  describe('#root', () => {
    it('should render nuxt if nuxt defined', async () => {
      const req = {};
      const res = {
        send: true,
      };

      await controller.root(req, res);

      expect((<any> controller).nuxt.render).toBeCalledWith(req, res);
    });

    it('should return an error if nuxt is disabled', async () => {
      (<any> controller).nuxt = undefined;

      const req = {};
      const res = {
        send: jest.fn(),
      };

      await controller.root(req, res);

      expect(res.send).toBeCalledWith('Nuxt is disabled');
    });
  });
});

/**
 * class-validator
 */

/* Node modules */

/* Third-party modules */

/* Files */

const mocks = jest.genMockFromModule('class-validator');

Object.keys(mocks)
  .forEach((key) => {
    mocks[key] = jest.fn((...settings: any[]) => (target: any, param: string) => {
      const metaKey = '__assignedMetadata__';
      const metaData = Reflect.getMetadata(metaKey, target) ?? {};

      if (!metaData[key]) {
        metaData[key] = [];
      }

      metaData[key].push({
        param,
        settings,
      });

      Reflect.defineMetadata(metaKey, metaData, target);
    });
  });


export = mocks;

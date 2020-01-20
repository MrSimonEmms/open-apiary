/**
 * crud
 */

/* Node modules */

/* Third-party modules */
import * as mod from '@nestjsx/crud';

/* Files */

(<any> mod).Crud = jest.fn((...guards: any[]) => (
  target: any,
  method: any,
  definition: any,
) => {
  if (definition?.value) {
    /* Applied to a method on instance */
    Reflect.defineMetadata('__mockedCrud__', guards, definition.value);
  } else {
    /* Applied to whole class */
    Reflect.defineMetadata('__mockedCrud__', guards, target);
  }
});

export = mod;

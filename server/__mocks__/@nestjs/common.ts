/**
 * common
 */

/* Node modules */

/* Third-party modules */
import * as mod from '@nestjs/common';

/* Files */

(<any> mod).HttpException = jest.fn();

(<any> mod).UseGuards = jest.fn((...guards: any[]) => (
  target: any,
  method: any,
  definition: any,
) => {
  if (definition?.value) {
    /* Applied to a method on instance */
    Reflect.defineMetadata('__mockedGuards__', guards, definition.value);
  } else {
    /* Applied to whole class */
    Reflect.defineMetadata('__mockedGuards__', guards, target);
  }
});

export = mod;

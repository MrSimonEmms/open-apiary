/**
 * passport
 */

/* Node modules */

/* Third-party modules */
import * as mod from '@nestjs/passport';

/* Files */

(<any> mod).AuthGuard = jest.fn((...args: any[]) => () => args);

export = mod;

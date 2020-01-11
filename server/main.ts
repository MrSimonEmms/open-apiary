/**
 * main
 */

/* Node modules */

/* Third-party modules */
import { NestFactory } from '@nestjs/core';

/* Files */
import AppModule from './app.module';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);

    const port = app.get('ConfigService').get('server.port');

    await app.listen(port);

    // @todo log when up and running with URL:port
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
})();

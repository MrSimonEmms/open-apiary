/**
 * main
 */

/* Node modules */

/* Third-party modules */
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

/* Files */
import AppModule from './app.module';

(async () => {
  let logger: Logger | undefined;

  try {
    const app = await NestFactory.create(AppModule, {
      logger: false,
    });
    logger = app.get(Logger);
    app.useLogger(logger);

    const port = app.get('ConfigService').get('server.port');

    await app.listen(port);

    logger.log('Application running', port);
  } catch (err) {
    if (logger) {
      logger.error('Fatal application error', err.stack, err.message);
    } else {
      console.error(`Fatal application error: ${err.message}`);
      console.error(err.stack);
    }
    process.exit(1);
  }
})();

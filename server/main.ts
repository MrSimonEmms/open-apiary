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
    await app.listen(3000);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
})();

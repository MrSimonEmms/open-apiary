/**
 * main
 */

/* Node modules */

/* Third-party modules */
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

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
    app.use(helmet());

    const options = new DocumentBuilder()
      .setTitle('Open Apiary')
      .setDescription('The Open Apiary API')
      .setVersion(process.env.npm_package_version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

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

/**
 * main
 */

/* Node modules */
import * as http from 'http';

/* Third-party modules */
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import helmet from 'helmet';

/* Files */
import AppModule from './app.module';

(async () => {
  let logger: Logger | undefined;

  try {
    const app = await NestFactory.create(AppModule);
    logger = app.get(Logger);
    app.useLogger(logger);
    app
      .use(helmet())
      .use(cookieParser())
      .use((req, res, next) => {
        const csrfEnabled = app.get('ConfigService').get('server.csrf');

        if (!csrfEnabled) {
          logger.warn('CSRF protection is disabled');
          next();
          return;
        }

        csurf({
          cookie: true,
        })(req, res, next);
      })
      .use((err, req, res, next) => {
        if (err?.code !== 'EBADCSRFTOKEN') {
          /* Error not CSRF related - passthru */
          next(err);
          return;
        }

        logger.warn({
          err,
        }, 'Invalid CSRF token');

        res.status(403);
        res.send({
          message: http.STATUS_CODES[403],
        });
      });

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

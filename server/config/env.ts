/**
 * env
 */

/* Node modules */
import * as path from 'path';

/* Third-party modules */
import { merge } from 'lodash';
import { TransportOptionsStatic } from 'nestjs-messenger';

/* Files */

let logging : boolean | string | undefined = false;
const loggingVar = process.env.DB_LOGGING;

if (loggingVar === 'true') {
  logging = true;
} else if (loggingVar === 'false') {
  logging = false;
} else {
  logging = loggingVar;
}

const cwd = process.cwd();

/* Look for a custom config file */
let config: { [key: string] : any};
try {
  /* Look for a config.js file */
  // eslint-disable-next-line global-require,import/no-dynamic-require
  config = require(`${cwd}/config.js`);
} catch {
  try {
    /* Look for a config.json file */
    // eslint-disable-next-line global-require,import/no-dynamic-require
    config = require(`${cwd}/config.json`);
  } catch {
    config = {};
  }
}

export default () => merge({
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    migrationsRun: process.env.DB_MIGRATIONS_RUN !== 'false',
    sync: process.env.DB_SYNC === 'true',
    logging: logging ?? false,
  },
  logging: {
    destination: process.env.LOG_DESTINATION,
    level: process.env.LOG_LEVEL,
  },
  messaging: {
    email: {
      enabled: process.env.EMAIL_MESSAGING_ENABLED === 'true',
      verifyConnectionOnBoot: process.env.EMAIL_MESSAGING_VERIFY_ON_BOOT !== 'false',
      generator: {
        preview: process.env.MESSAGE_PREVIEW === 'true',
        engine: 'pug',
        templateDir: path.join(__dirname, '..', 'messenger', 'email'),
      },
      transport: {
        host: process.env.EMAIL_TRANSPORT_HOST,
        port: Number(process.env.EMAIL_TRANSPORT_PORT),
        secure: process.env.EMAIL_TRANSPORT_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_TRANSPORT_AUTH_USER,
          pass: process.env.EMAIL_TRANSPORT_AUTH_PASS,
        },
      } as TransportOptionsStatic,
    },
  },
  jwt: {
    expiry: process.env.JWT_EXPIRY || '30 days',
    issuer: process.env.JWT_ISSUER || 'open-apiary',
    secret: process.env.JWT_SECRET || '',
  },
  server: {
    // Removing CSRF protection should only be done in development
    csrf: process.env.CSRF_DISABLED !== 'true',
    port: Number(process.env.PORT || 3000),
    upload: process.env.UPLOAD_PATH || path.join(process.cwd(), 'upload'),
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    url: process.env.WEATHER_URL,
  },
}, config);

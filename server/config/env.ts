/**
 * env
 */

/* Node modules */

/* Third-party modules */

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

export default () => ({
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
  jwt: {
    expiry: process.env.JWT_EXPIRY || '30 days',
    issuer: process.env.JWT_ISSUER || 'open-apiary',
    secret: process.env.JWT_SECRET || '',
  },
  server: {
    port: Number(process.env.PORT || 3000),
  },
});

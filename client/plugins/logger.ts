/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import { Plugin } from '@nuxt/types'; // eslint-disable-line import/no-unresolved
import { Vue } from 'vue-property-decorator';
import pino from 'pino';
import Queue from 'better-queue';
import uuid from 'uuid';

/* Files */
import Logger from '../lib/logger';
import { ILogger } from '../interfaces/logger';

const MemoryStore = require('better-queue-memory');

declare module 'vue/types/vue' {
  interface Vue {
    $log: ILogger;
  }
  interface VueConstructor {
    $log: ILogger;
  }
}

let logLevel : string = '';

if (process.server) {
  /* Get log level from envvar */
  logLevel = process.env.LOG_LEVEL || 'info';
} else if (process.client) {
  /* Get log level from */
  logLevel = Logger.getDebugLevel('debug', /^apiary:/);
}

if (logLevel) {
  if (!pino.levels.values[logLevel]) {
    /* Invalid log level - warn and ignore */
    const validLevels : string[] = [
      '*',
      'silent',
      ...Object.keys(pino.levels.values),
    ];

    const msg = `Application is being debugged with an invalid log level: "${logLevel}".
Valid levels are: ${validLevels.join(', ')}`;

    // eslint-disable-next-line no-console
    console.error(msg);

    logLevel = 'silent';
  }
} else {
  /* Not set - use "silent" */
  logLevel = 'silent';
}

const plugin : Plugin = ({ store }) : void => {
  /* Create a memory queue for log messages to avoid loads of HTTP requests */
  const queue = new Queue<{
    id: string;
    level: pino.Level;
    logEvent: pino.LogEvent;
  }>(async (input, cb) => {
    try {
      await store.dispatch('app/logTransport', input);

      cb(null);
    } catch (err) {
      console.error(err);

      cb(err);
    }
  }, {
    batchSize: 50,
    batchDelay: 5000,
    batchDelayTimeout: 1000,
    filo: false,
    maxRetries: 3,
    maxTimeout: 1000,
    /* Connect here as the library can't use the dynamic require */
    store: new MemoryStore(),
  });

  const logInst: pino.Logger = pino({
    name: 'www',
    level: logLevel || 'silent',
    browser: {
      asObject: true,
      serialize: true,
      transmit: {
        level: 'trace',
        send(level: pino.Level, logEvent: pino.LogEvent) {
          queue.push({
            level,
            logEvent,
            id: uuid.v4(),
          });
        },
      },
    },
  });

  const logger = new Logger(logInst);

  Vue.use((app) => {
    Vue.set(Vue, '$log', logger);
    Vue.set(app.prototype, '$log', logger);
  });

  if (process.server) {
    store.commit('app/setUUID', uuid.v4());
  }

  logger.logId = store.getters['app/correlationId'];

  logger.debug('Log level', {
    logLevel: logLevel || 'silent',
  });
};

export default plugin;

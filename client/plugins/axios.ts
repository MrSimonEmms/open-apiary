/**
 * axios
 */

/* Node modules */

/* Third-party modules */
import { Plugin } from '@nuxt/types'; // eslint-disable-line import/no-unresolved
import { Vue } from 'vue-property-decorator';
import { AxiosRequestConfig } from 'axios';

/* Files */

function canLog(config: AxiosRequestConfig) : boolean {
  /* Don't log if sending to log endpoint - it will exponentially increase calls till BOOM! */
  return config.url !== '/api/log';
}

const plugin : Plugin = ({ $axios, store }) : void => {
  const { $log: log } = Vue;
  const { logId } = log;

  /* Log requests and responses */
  $axios.onRequest((config) => {
    /* Do a case-insensitive search for the authorization header */
    const authHeader = Object.keys(config.headers)
      .find((key) => key.toUpperCase() === 'AUTHORIZATION');

    if (!authHeader || !config.headers[authHeader]) {
      /* Authorization header not present - see if logged in */
      const token = store.getters['user/token'];

      if (token) {
        if (canLog(config)) {
          log.debug('Automatically adding authorization token to Axios call');
        }

        Vue.set(config.headers, 'authorization', `Bearer ${token}`);
      } else if (canLog(config)) {
        log.debug('Not adding auth header as no valid token');
      }
    } else if (canLog(config)) {
      log.debug('Not checking to add auth header as already set');
    }

    if (canLog(config)) {
      log.debug('New HTTP request', {
        config,
      });
    }
  });

  $axios.onResponse((result) => {
    if (canLog(result.config)) {
      log.debug('HTTP response', {
        result,
      });
    }
  });

  $axios.onError((err) => {
    if (canLog(err.config)) {
      log.error('HTTP error', {
        err,
      });
    }
  });

  /* Add correlation id to the outgoing call */
  if (logId) {
    $axios.setHeader('x-correlation-id', logId);
  }
};

export default plugin;

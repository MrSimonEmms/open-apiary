/**
 * axios
 */

/* Node modules */

/* Third-party modules */
import { Plugin } from '@nuxt/types'; // eslint-disable-line import/no-unresolved
import { Vue } from 'vue-property-decorator';

/* Files */

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
        log.debug('Automatically adding authorization token to Axios call');

        Vue.set(config.headers, 'authorization', `Bearer ${token}`);
      } else {
        log.debug('Not adding auth header as no valid token');
      }
    } else {
      log.debug('Not checking to add auth header as already set');
    }

    log.debug('New HTTP request', {
      config,
    });
  });

  $axios.onResponse((result) => {
    log.debug('HTTP response', {
      result,
    });
  });

  $axios.onError((err) => {
    log.error('HTTP error', {
      err,
    });
  });

  /* Add correlation id to the outgoing call */
  if (logId) {
    $axios.setHeader('x-correlation-id', logId);
  }
};

export default plugin;

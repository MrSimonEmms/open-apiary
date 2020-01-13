/**
 * vuexPersistedState
 */

/* Node modules */
import { ServerResponse } from 'http';

/* Third-party modules */
import { Plugin } from '@nuxt/types'; // eslint-disable-line import/no-unresolved
import cookieUniversal from 'cookie-universal';
import createPersistedState from 'vuex-persistedstate';
import { IncomingMessage } from 'connect'; // eslint-disable-line import/no-extraneous-dependencies
import { CookieSerializeOptions } from 'cookie'; // eslint-disable-line import/no-extraneous-dependencies

/* Files */

function factory(req: IncomingMessage, res: ServerResponse, setOpts: CookieSerializeOptions = {}) {
  const cookie = cookieUniversal(req, res);

  // @todo may have to set the domain - check once deployed
  const opts = {
    ...setOpts,
    path: '/',
    strict: true,
  };

  return {
    getItem: (key: string) : any => cookie.get(key, {
      parseJSON: false,
    }),
    // @todo as above, remove might need domain
    removeItem: (key: string) : void => cookie.remove(key, {
      path: '/',
    }),
    setItem: (key: string, value: any) : void => cookie.set(key, value, opts),
  };
}

const plugin : Plugin = ({ req, res, store }) : void => {
  /* This is for data that's persisted after this session */
  createPersistedState({
    key: 'oa-persistence',
    paths: [
      'app.drawerMini',
      'user.token',
    ],
    storage: factory(req, res, {
      expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365 * 10)), /* Last for 10 years */
    }),
  })(store);

  /* This is for data that's wiped once the session is over */
  createPersistedState({
    key: 'oa-session',
    paths: [
      'user.redirect',
      'user.tokenSession',
    ],
    storage: factory(req, res),
  })(store);
};

export default plugin;

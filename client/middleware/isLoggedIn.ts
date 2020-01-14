/**
 * isLoggedIn
 */

/* Node modules */

/* Third-party modules */
import { Middleware } from '@nuxt/types'; // eslint-disable-line import/no-unresolved
import { Vue } from 'vue-property-decorator';

/* Files */

const middleware : Middleware = async ({ redirect, route, store }) => {
  const isLoggedIn : boolean = !!store.getters['user/token'];

  if (isLoggedIn) {
    /* Logged in, get the user data */
    try {
      await store.dispatch('user/loadUser');
      Vue.$log.info('User login token is valid');

      return;
    } catch (err) {
      Vue.$log.info('User\'s login token invalid - logging out', {
        err,
      });
    }
  } else {
    Vue.$log.info('User has no login token');
  }

  /* If we get here, we're not logged in - log out */
  store.commit('user/logout');
  store.commit('user/setRedirect', route);

  redirect({
    name: 'login',
  });
};

export default middleware;

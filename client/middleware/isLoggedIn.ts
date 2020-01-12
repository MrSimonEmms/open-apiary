/**
 * isLoggedIn
 */

/* Node modules */

/* Third-party modules */
import { Middleware } from '@nuxt/types'; // eslint-disable-line import/no-unresolved

/* Files */

const middleware : Middleware = async ({ redirect, route, store }) => {
  const isLoggedIn : boolean = !!store.getters['user/token'];

  if (isLoggedIn) {
    /* Logged in, get the user data */
    await store.dispatch('user/loadUser');
  } else {
    /* If we're not logged in, go to login page */
    store.commit('user/logout');
    store.commit('user/setRedirect', route);

    redirect({
      name: 'login',
    });
  }
};

export default middleware;

/**
 * isNotLoggedIn
 */

/* Node modules */

/* Third-party modules */
import { Middleware } from '@nuxt/types'; // eslint-disable-line import/no-unresolved

/* Files */

const middleware : Middleware = ({ redirect, store }) => {
  const isLoggedIn : boolean = !!store.getters['user/token'];

  /* If we're logged in, go to home page */
  if (isLoggedIn) {
    redirect({
      name: 'index',
    });
  }
};

export default middleware;

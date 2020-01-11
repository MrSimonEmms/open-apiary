/**
 * isLoggedIn
 */

/* Node modules */

/* Third-party modules */
import { Middleware } from '@nuxt/types'; // eslint-disable-line import/no-unresolved

/* Files */

const middleware : Middleware = ({ redirect }) => {
  // @todo call store
  const isLoggedIn = false;

  /* If we're not logged in, go to login page */
  if (!isLoggedIn) {
    redirect({
      name: 'login',
    });
  }
};

export default middleware;

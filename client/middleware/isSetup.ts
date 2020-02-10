/**
 * isSetup
 */

/* Node modules */

/* Third-party modules */
import { Middleware } from '@nuxt/types'; // eslint-disable-line import/no-unresolved

/* Files */

const middleware : Middleware = async ({ redirect, store }) => {
  const { isSetup } = await store.dispatch('app/isSetup');

  if (!isSetup) {
    redirect({
      name: 'setup',
    });
  }
};

export default middleware;

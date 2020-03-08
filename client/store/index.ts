/**
 * index
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

/* Files */

export interface RootState {
  csrfToken: string | null;
}

const indexStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    nuxtServerInit({ commit }, { req }) {
      Vue.$log.debug('Requesting CSRF token');

      let token : string | null = null;
      try {
        token = req.csrfToken();
      } catch (err) {
        Vue.$log.error('Failed to get CSRF token', {
          err,
        });
      }

      commit('setCSRFToken', token);
    },
  },

  mutations: {
    setCSRFToken(state, token: string | null = null) {
      Vue.set(state, 'csrfToken', token);
    },
  },

  getters: {
    csrfToken: (state) => state.csrfToken,
  },

  state: () => ({
    csrfToken: null,
  }),
};
export default indexStore;

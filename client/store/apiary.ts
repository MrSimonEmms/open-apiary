/**
 * apiary
 */

/* Node modules */

/* Third-party modules */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

/* Files */
import { IApiary } from '../../server/apiary/interfaces/apiary';

export interface RootState {
  list: IApiary[],
}

const apiaryStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async loadAll({ commit, getters }) : Promise<IApiary[]> {
      const list = await this.$axios.$get<IApiary[]>('/api/apiary');

      commit('setList', list);

      return getters.list;
    },
  },

  mutations: {
    setList(state, list: IApiary[]) {
      Vue.set(state, 'list', list);
    },
  },

  getters: {
    list: (state) => state.list,
  },

  state: () => ({
    list: [],
  }),
};

export default apiaryStore;

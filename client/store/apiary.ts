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
  active: IApiary | {},
  activeId: number | null,
  list: IApiary[],
}

const apiaryStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async loadApiary({ commit, getters }, id: number) {
      const item = await this.$axios.$get<IApiary | undefined>(`/api/apiary/${id}`);

      if (item) {
        commit('setActive', item);
      } else {
        commit('setActive');
      }

      return getters.active;
    },

    async loadAll({ commit, getters }) : Promise<IApiary[]> {
      const list = await this.$axios.$get<IApiary[]>('/api/apiary');

      commit('setList', list);

      return getters.list;
    },

    async save({ commit, getters }, id?: number) : Promise<IApiary> {
      let apiary: IApiary;
      const data = getters.active;

      if (id) {
        /* Update existing apiary */
        apiary = await this.$axios.$put<IApiary>(`/api/apiary/${id}`, data);
      } else {
        /* Create new apiary */
        apiary = await this.$axios.$post<IApiary>('/api/apiary', data);
      }

      /* Update the active data */
      commit('setActive', apiary);

      return getters.active;
    },
  },

  mutations: {
    setActive(state, apiary: IApiary | {} = {}) {
      Vue.set(state, 'active', apiary);
    },

    setList(state, list: IApiary[]) {
      Vue.set(state, 'list', list);
    },

    updateActive(state: any, { key, value }: { key: string, value: any }) {
      Vue.set(state.active, key, value);
    },
  },

  getters: {
    active: (state) => state.active,
    list: (state) => state.list,
  },

  state: () => ({
    active: {},
    activeId: null,
    list: [],
  }),
};

export default apiaryStore;

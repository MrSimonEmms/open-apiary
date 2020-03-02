/**
 * apiary
 */

/* Node modules */

/* Third-party modules */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

/* Files */
import { IApiary } from '../../server/apiary/interfaces/apiary';
import { ICurrentWeather } from '../../server/apiary/interfaces/openWeather';

export interface RootState {
  active: IApiary | {},
  activeId: number | null,
  list: IApiary[],
  weather: ICurrentWeather | null,
}

const apiaryStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async delete(_context, id: number) {
      await this.$axios.$delete(`/api/apiary/${id}`);
    },

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

    async weather({ commit, getters }, id: number) : Promise<ICurrentWeather> {
      const weather = await this.$axios.$get<ICurrentWeather>(`/api/apiary/${id}/weather`);

      commit('setWeather', weather);

      return getters.weather;
    },
  },

  mutations: {
    setActive(state, apiary: IApiary | {} = {}) {
      Vue.set(state, 'active', apiary);
    },

    setList(state, list: IApiary[]) {
      Vue.set(state, 'list', list);
    },

    setWeather(state, weather: ICurrentWeather) {
      Vue.set(state, 'weather', weather);
    },

    updateActive(state: any, { key, value }: { key: string, value: any }) {
      Vue.set(state.active, key, value);
    },
  },

  getters: {
    active: (state) => state.active,
    list: (state) => state.list,
    weather: (state) => state.weather,
  },

  state: () => ({
    active: {},
    activeId: null,
    list: [],
    weather: null,
  }),
};

export default apiaryStore;

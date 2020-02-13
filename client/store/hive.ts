/**
 * hive
 */

/* Node modules */

/* Third-party modules */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

/* Files */
import { IHive, IInspection } from '../../server/apiary/interfaces/apiary';
import { IPagination } from '../interfaces/pagination';

export interface RootState {
  active: IHive | {},
  activeId: number | null,
  inspections: IInspection[], // @todo
  inspectionPagination: Omit<IPagination<IInspection>, 'data'>
}

const hiveStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async delete(_store, { apiaryId, hiveId }: {
      apiaryId: number,
      hiveId: number,
    }) {
      await this.$axios.$delete(`/api/apiary/${apiaryId}/hive/${hiveId}`);
    },

    async deleteInspection({ commit }, { apiaryId, hiveId, inspectionId }: {
      apiaryId: number,
      hiveId: number,
      inspectionId: number,
    }) {
      await this.$axios.$delete(`/api/apiary/${apiaryId}/hive/${hiveId}/inspection/${inspectionId}`);

      commit('deleteInspection', inspectionId);
    },

    async load({ commit, getters }, { apiaryId, hiveId }: {
      apiaryId: number,
      hiveId: number,
    }) {
      const item = await this.$axios.$get<IHive | undefined>(`/api/apiary/${apiaryId}/hive/${hiveId}`);

      if (item) {
        commit('setActive', item);
      } else {
        commit('setActive');
      }

      return getters.active;
    },

    async inspections({ commit, getters }, {
      apiaryId,
      hiveId,
      page = 1,
      limit = 5,
      sort = 'date',
      sortDir = 'DESC',
      search,
    }: {
      apiaryId: number,
      hiveId: number,
      page: number,
      limit: number,
      sort: string,
      sortDir: 'ASC' | 'DESC',
      search?: string,
    }) {
      const params : { [key: string] : any } = {
        page,
        limit,
        sort: `${sort},${sortDir}`,
      };

      if (search) {
        params.filter = `date||$cont||${search}`;
      }

      Vue.$log.debug('Getting inspection list', {
        apiaryId,
        hiveId,
        params,
      });

      try {
        const items = await this.$axios
          .$get<IPagination<IInspection>>(`/api/apiary/${apiaryId}/hive/${hiveId}/inspection`, {
            params,
          });

        commit('setInspections', items.data);
        commit('setInspectionPagination', items);
      } catch (err) {
        Vue.$log.error('Error filtering data', {
          err,
        });

        commit('setInspections', []);
        commit('setInspectionPagination', {
          count: 0,
          total: 0,
          page: 1,
          pageCount: 1,
        });
      }

      return getters.inspections;
    },

    async save({ dispatch }, {
      apiaryId,
      hive,
    }: {
      apiaryId: number,
      hive: IHive,
    }) {
      let hiveId = hive?.id ?? 0;

      if (hiveId === 0) {
        Vue.$log.info('Creating new hive', {
          hive,
          apiaryId,
        });

        const { id } = await this.$axios.$post(`/api/apiary/${apiaryId}/hive`, hive);

        hiveId = id;
      } else {
        Vue.$log.info('Updating existing hive', {
          hive,
          apiaryId,
        });

        await this.$axios.$put(`/api/apiary/${apiaryId}/hive/${hive.id}`, hive);
      }

      await dispatch('load', {
        apiaryId,
        hiveId,
      });

      return hiveId;
    },

    async saveInspection(_store, {
      data,
      id,
      apiaryId,
      hiveId,
    }: {
      data: IInspection;
      id: number;
      apiaryId: number;
      hiveId: number;
    }) {
      const url = `/api/apiary/${apiaryId}/hive/${hiveId}/inspection`;

      if (id === 0) {
        /* New inspection */
        Vue.$log.info('Saving new inspection for hive', {
          data,
          apiaryId,
          hiveId,
        });

        await this.$axios.$post(url, data);
      } else {
        /* Updating inspection */
        Vue.$log.info('Saving updated inspection for hive', {
          id,
          data,
          apiaryId,
          hiveId,
        });

        await this.$axios.$put(`${url}/${id}`, data);
      }
    },
  },

  mutations: {
    deleteInspection(state, inspectionId: number) {
      const inspections = state.inspections.filter(({ id }) => id !== inspectionId);

      Vue.set(state, 'inspections', inspections);
    },

    setActive(state, hive: IHive | {} = {}) {
      Vue.set(state, 'active', hive);
    },

    setInspections(state, inspections: IInspection[] = []) {
      Vue.set(state, 'inspections', inspections);
    },

    setInspectionPagination(state, pagination: IPagination<never>) {
      Vue.set(state.inspectionPagination, 'count', pagination.count);
      Vue.set(state.inspectionPagination, 'page', pagination.page);
      Vue.set(state.inspectionPagination, 'pageCount', pagination.pageCount);
      Vue.set(state.inspectionPagination, 'total', pagination.total);
    },
  },

  getters: {
    active: (state) => state.active,

    activeId: (state) => state.activeId,

    getAbbreviation: () => (words: string, allowUncertain : boolean = true) => {
      /* Split each word an present the initial */
      const abbrev = words.split(' ')
        .map((word) => word[0]);

      if (allowUncertain) {
        /* If there's a question mark present, treat as uncertain */
        const unsure = /\?/.test(words);

        if (unsure) {
          abbrev.push('?');
        }
      }

      return abbrev
        .join('')
        .toUpperCase();
    },

    inspections: (state) => state.inspections,

    inspectionPagination: (state) => state.inspectionPagination,
  },

  state: () => ({
    active: {},
    activeId: null,
    inspections: [],
    inspectionPagination: {
      count: 0,
      total: 0,
      page: 1,
      pageCount: 1,
    },
  }),
};

export default hiveStore;

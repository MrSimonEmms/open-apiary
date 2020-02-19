/**
 * media
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

/* Files */
import { IMedia } from '../../server/media/interfaces/media';
import { IPagination } from '../interfaces/pagination';

export interface RootState {
  media: IMedia[],
  pagination: Omit<IPagination<IMedia>, 'data'>
}

const mediaStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async delete(_store, ids: number[]) {
      await Promise.all(ids.map(async (id) => {
        try {
          await this.$axios.$delete(`/api/media/${id}`);
        } catch (err) {
          Vue.$log.error('Error deleting file', {
            id,
            err,
          });

          throw err;
        }
      }));
    },

    async list({ commit, getters }, {
      page = 1,
      limit = 5,
      sort = 'originalFileName',
      sortDir = 'ASC',
      search,
    } : {
      page?: number,
      limit?: number,
      sort?: string,
      sortDir?: 'ASC' | 'DESC',
      search?: string,
    } = {}) {
      const params : { [key: string] : any } = {
        page,
        limit,
        sort: `${sort},${sortDir}`,
      };

      if (search) {
        params.filter = `originalFileName||$cont||${search}`;
      }

      Vue.$log.debug('Getting media list', {
        params,
      });

      try {
        const items = await this.$axios
          .$get<IPagination<IMedia>>('/api/media', {
            params,
          });

        commit('setMedia', items.data);
        commit('setPagination', items);
      } catch (err) {
        Vue.$log.error('Error retrieving media', {
          err,
        });

        commit('setMedia', []);
        commit('setPagination', {
          count: 0,
          total: 0,
          page: 1,
          pageCount: 1,
        });
      }

      return getters.list;
    },

    async upload(_store, data: FormData) {
      await this.$axios.$post('/api/media', data);
    },
  },

  getters: {
    list: (state) => state.media,
    pagination: (state) => state.pagination,
  },

  mutations: {
    setMedia(state, media: IMedia[] = []) {
      Vue.set(state, 'media', media);
    },

    setPagination(state, pagination: IPagination<never>) {
      Vue.set(state.pagination, 'count', pagination.count);
      Vue.set(state.pagination, 'page', pagination.page);
      Vue.set(state.pagination, 'pageCount', pagination.pageCount);
      Vue.set(state.pagination, 'total', pagination.total);
    },
  },

  state: () => ({
    media: [],
    pagination: {
      count: 0,
      total: 0,
      page: 1,
      pageCount: 1,
    },
  }),
};

export default mediaStore;

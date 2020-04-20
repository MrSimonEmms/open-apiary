/**
 * user
 */

/* Node modules */
import crypto from 'crypto';
import qs from 'querystring';

/* Third-party modules */
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

/* Files */
import { IUserLoginDTO, IUser } from '../../server/user/interfaces/user';

export interface RootState extends Partial<IUserLoginDTO>{
  redirect?: string;
  tokenSession?: string; // Where we store the token if not remembering
}

interface ILoginDTO extends IUser {
  rememberMe: boolean;
}

const userStore : {
  actions: ActionTree<RootState, RootState>;
  getters: GetterTree<RootState, RootState>;
  mutations: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    async create(_store, data: IUser) {
      await this.$axios.$post('/api/user', data);
    },

    async delete(_store, id: number) {
      await this.$axios.$delete(`/api/user/${id}`);
    },

    async forgottenPassword(_store, emailAddress: string) {
      await this.$axios.$post('/api/user/forgot-password', {
        emailAddress,
      });
    },

    async loadUser({ commit }) {
      const user = await this.$axios.$get('/api/user');

      /* Set the user data */
      commit('user', user);
    },

    async list({ state }, opts : {
      emailAddress?: string;
      filterActive?: boolean;
    } = {}) : Promise<IUser[]> {
      const params : { [key:string] : any } = {
        filter: [],
      };

      const { user } = state;

      if (user && opts.filterActive) {
        params.filter.push(`id||ne||${user.id}`);
      }

      if (opts.emailAddress) {
        params.filter.push(`emailAddress||eq||${opts.emailAddress}`);
      }

      return this.$axios.$get('/api/user/list', {
        params,
      });
    },

    async login({ commit }, { emailAddress, password, rememberMe = false } : ILoginDTO) {
      try {
        const user = await this.$axios.$post('/api/user/auth', {
          emailAddress,
          password,
        });

        /* Set the data */
        commit('expires', user.expires);
        commit('user', user.user);
        if (rememberMe) {
          commit('token', user.token);
          commit('tokenSession');
        } else {
          commit('token');
          commit('tokenSession', user.token);
        }
      } catch (err) {
        /* Remove the data */
        commit('logout');
        throw err;
      }
    },

    async update({ dispatch }, data: IUser) {
      await this.$axios.$put('/api/user', data);

      await dispatch('loadUser');
    },

    async updateForgottenPassword(
      _store,
      { password, token } : { password: string, token: string },
    ) {
      await this.$axios.$put('/api/user', {
        password,
      }, {
        headers: {
          authorization: `bearer ${token}`,
        },
      });
    },
  },

  getters: {
    expires: (state) => state.expires,
    gravatar: (_state, getters) => ({
      defaultImg = 'mp',
      size = 32,
    }: {
      defaultImg?: string;
      size?: number;
    } = {}) : string | void => {
      const emailAddress = getters?.user?.emailAddress;

      if (!emailAddress) {
        return undefined;
      }

      const md5 = crypto.createHash('md5')
        .update(emailAddress)
        .digest('hex');

      const opts = {
        d: defaultImg,
        s: size,
      };

      return `https://www.gravatar.com/avatar/${md5}?${qs.stringify(opts)}`;
    },
    redirect: (state) => {
      if (!state.redirect) {
        return undefined;
      }

      try {
        return JSON.parse(state.redirect);
      } catch (err) {
        return undefined;
      }
    },
    token: (state) => state.token ?? state.tokenSession,
    user: (state) => state.user,
  },

  mutations: {
    expires(state, expires?) {
      const expiresData = expires ? new Date(expires) : undefined;

      Vue.set(state, 'expires', expiresData);
    },

    logout(state) {
      Vue.set(state, 'expires', undefined);
      Vue.set(state, 'token', undefined);
      Vue.set(state, 'tokenSession', undefined);
      Vue.set(state, 'user', undefined);
    },

    setRedirect(state, fullPath) {
      Vue.set(state, 'redirect', JSON.stringify(fullPath));
    },

    token(state, token?) {
      Vue.set(state, 'token', token);
    },

    tokenSession(state, token?) {
      Vue.set(state, 'tokenSession', token);
    },

    user(state, user?) {
      Vue.set(state, 'user', user);
    },
  },

  state: () => ({
    expires: undefined,
    redirect: undefined,
    token: undefined,
    tokenSession: undefined,
    user: undefined,
  }),
};

export default userStore;

/**
 * app
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
import uuid from 'uuid';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

/* Files */
import { ISystemMsg } from '../interfaces/app';

interface ISystemMsgItem {
  key: string;
  message: ISystemMsg;
}

export interface RootState {
  drawer: boolean | null;
  drawerMini: boolean;
  setupStage: number;
  systemMessage: ISystemMsgItem[]
  title?: string;
  uuid: string | null;
}

const appStore : {
  actions?: ActionTree<RootState, RootState>;
  getters?: GetterTree<RootState, RootState>;
  mutations?: MutationTree<RootState>;
  state: () => RootState;
} = {
  actions: {
    isSetup() {
      return this.$axios.$get('/api/user/setup');
    },
  },

  mutations: {
    addSystemMessage(state, msg: ISystemMsg | string) {
      const messages : ISystemMsgItem[] = [
        ...state.systemMessage,
      ];

      /* Default options */
      let message : ISystemMsg = {
        msg: '',
        top: false,
        bottom: true,
        left: false,
        right: false,
        timeout: 5000,
        multiLine: false,
        vertical: false,
      };

      if (typeof msg === 'string') {
        message.msg = msg;
      } else {
        message = {
          ...message,
          ...msg,
        };
      }

      messages.push({
        message,
        key: uuid.v4(),
      });

      Vue.set(state, 'systemMessage', messages);
    },

    removeSystemMessage(state, key: string) {
      const messages : ISystemMsgItem[] = [
        ...state.systemMessage,
      ].filter((item) => item.key !== key);

      Vue.set(state, 'systemMessage', messages);
    },

    setDrawerDisplay(state, display: boolean) {
      Vue.set(state, 'drawer', display);
    },

    setDrawerMini(state, isMini: boolean) {
      Vue.set(state, 'drawerMini', isMini);
    },

    setPageTitle(state, title?: string) {
      Vue.set(state, 'title', title);
    },

    setSetupStage(state, stage: number) {
      if (stage > state.setupStage) {
        Vue.set(state, 'setupStage', stage);
      }
    },

    setUUID(state, str: string) {
      Vue.set(state, 'uuid', str);
    },
  },

  getters: {
    appName: () => 'Open Apiary',
    correlationId: (state) => state.uuid,
    drawerDisplay: (state) => state.drawer,
    isDrawerMini: (state) => state.drawerMini,
    pageTitle: (state) => state.title,
    setupStage: (state) => state.setupStage,
    systemMessages: (state) => state.systemMessage,
  },

  state: () => ({
    drawer: null,
    drawerMini: false,
    setupStage: 1,
    systemMessage: [],
    title: undefined,
    uuid: null,
  }),
};
export default appStore;

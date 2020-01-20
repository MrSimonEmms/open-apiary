/**
 * app
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import uuid from 'uuid';

/* Files */
import { ISystemMsg } from '../interfaces/app';

interface ISystemMsgItem {
  key: string;
  message: ISystemMsg;
}

@Module({
  name: 'app',
  stateFactory: true,
  namespaced: true,
})
export default class AppStore extends VuexModule {
  drawer: boolean | null = null;

  drawerMini: boolean = false;

  systemMessage: ISystemMsgItem[] = [];

  title?: string;

  uuid : string | null = null;

  // eslint-disable-next-line class-methods-use-this
  get appName() {
    return 'Open Apiary';
  }

  get correlationId() {
    return this.uuid;
  }

  get drawerDisplay() {
    return this.drawer;
  }

  get isDrawerMini() {
    return this.drawerMini;
  }

  get pageTitle() {
    return this.title;
  }

  get systemMessages() {
    return this.systemMessage;
  }

  @Mutation
  addSystemMessage(msg: ISystemMsg | string) {
    const messages : ISystemMsgItem[] = [
      ...this.systemMessage,
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

    Vue.set(this, 'systemMessage', messages);
  }

  @Mutation
  removeSystemMessage(key: string) {
    const messages : ISystemMsgItem[] = [
      ...this.systemMessage,
    ].filter((item) => item.key !== key);

    Vue.set(this, 'systemMessage', messages);
  }

  @Mutation
  setDrawerDisplay(state: boolean) {
    Vue.set(this, 'drawer', state);
  }

  @Mutation
  setDrawerMini(isMini: boolean) {
    Vue.set(this, 'drawerMini', isMini);
  }

  @Mutation
  setPageTitle(title?: string) {
    Vue.set(this, 'title', title);
  }

  @Mutation
  setUUID(str: string) {
    Vue.set(this, 'uuid', str);
  }
}

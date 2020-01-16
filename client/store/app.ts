/**
 * app
 */

/* Node modules */

/* Third-party modules */
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

/* Files */

@Module({
  name: 'app',
  stateFactory: true,
  namespaced: true,
})
export default class AppStore extends VuexModule {
  drawer: boolean | null = null;

  drawerMini: boolean = false;

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

  @Mutation
  setDrawerDisplay(state: boolean) {
    this.drawer = state;
  }

  @Mutation
  setDrawerMini(isMini: boolean) {
    this.drawerMini = isMini;
  }

  @Mutation
  setUUID(uuid: string) {
    this.uuid = uuid;
  }
}

/**
 * app
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
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
  setUUID(uuid: string) {
    Vue.set(this, 'uuid', uuid);
  }
}

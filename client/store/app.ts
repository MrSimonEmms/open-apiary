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
  uuid : string | null = null;

  get correlationId() {
    return this.uuid;
  }

  @Mutation
  setUUID(uuid: string) {
    this.uuid = uuid;
  }
}

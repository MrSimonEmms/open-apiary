<template lang="pug">
  oa-hive-editor(
    v-model="hive"
    :apiaryId="apiaryId"
  )
</template>

<script lang="ts">
/**
 * settings
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IHive } from '../../../../../server/apiary/interfaces/apiary';

declare module 'vue/types/vue' {
  interface Vue {
    setPageTitle(): void;
  }
}

@Component({
  created() {
    this.setPageTitle();
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class HiveEditPage extends Vue {
  get apiaryId() {
    return Number(this.$route.params.id);
  }

  get hive() {
    return this.$store.getters['hive/active'];
  }

  set hive(hive: IHive) {
    this.$store.commit('hive/setActive', hive);
  }

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'hive:EDIT.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

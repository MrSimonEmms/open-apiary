<template lang="pug">
  oa-hive-editor(
    :apiaryId="apiaryId"
  )
</template>

<script lang="ts">
/**
 * create
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

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
export default class NewHivePage extends Vue {
  get apiaryId() {
    return Number(this.$route.params.id);
  }

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'hive:CREATE.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

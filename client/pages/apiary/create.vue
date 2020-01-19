<template lang="pug">
  oa-apiary-editor()
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

  fetch({ store }) {
    /* Reset the active apiary in case going "back" */
    store.commit('apiary/setActive');
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class ApiaryCreatePage extends Vue {
  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'apiary:ITEM.NEW.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

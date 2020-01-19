<template lang="pug">
  oa-apiary-editor(
    :id="apiaryId"
  )
</template>

<script lang="ts">
/**
 * edit
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IApiary } from '../../../../server/apiary/interfaces/apiary';

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
export default class ApiaryIDEditPage extends Vue {
  get apiary() : IApiary {
    return this.$store.getters['apiary/active'];
  }

  get apiaryId() : number {
    return Number(this.$route.params.id);
  }

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'apiary:ITEM.EDIT.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

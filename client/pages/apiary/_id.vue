<template lang="pug">
  nuxt-child
</template>

<script lang="ts">
/**
 * _id
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IApiary } from '../../../server/apiary/interfaces/apiary';

@Component({
  async fetch({ route, store }) {
    /* Required to populate data if no on the index page */
    await store.dispatch('apiary/loadApiary', route.params.id);
  },

  async validate({ route, store }) : Promise<boolean> {
    const id = Number(route.params.id);

    if (Number.isNaN(id)) {
      return false;
    }

    try {
      const apiary = await store.dispatch('apiary/loadApiary', id);

      return !!apiary;
    } catch (err) {
      if (err.response.status === 404) {
        /* Apiary not found */
        return false;
      }

      throw err;
    }
  },
})
export default class ApiaryIdPage extends Vue {
  get apiary() : IApiary {
    return this.$store.getters['apiary/active'];
  }

  get apiaryId() : number {
    return Number(this.$route.params.id);
  }
}
</script>

<style lang="scss" scoped>

</style>

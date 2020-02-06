<template lang="pug">
  nuxt-child
</template>

<script lang="ts">
/**
 * _hive
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  async fetch({ route, store }) {
    /* Required to populate data if no on the index page */
    await store.dispatch('hive/load', {
      apiaryId: route.params.id,
      hiveId: route.params.hive,
    });

    await store.dispatch('hive/inspections', {
      apiaryId: route.params.id,
      hiveId: route.params.hive,
      page: route.query.page,
      limit: route.query.limit,
      search: route.query.q,
    });
  },

  async validate({ route, store }) : Promise<boolean> {
    const apiaryId = Number(route.params.id);
    const hiveId = Number(route.params.hive);

    if (Number.isNaN(apiaryId) || Number.isNaN(hiveId)) {
      return false;
    }

    try {
      const hive = await store.dispatch('hive/load', {
        apiaryId: route.params.id,
        hiveId: route.params.hive,
      });

      return !!hive;
    } catch (err) {
      if (err.response.status === 404) {
        /* Apiary not found */
        return false;
      }

      throw err;
    }
  },
})
export default class HiveWrapper extends Vue {
  get hive() {
    return this.$store.getters['hive/active'];
  }
}
</script>

<style lang="scss" scoped>

</style>

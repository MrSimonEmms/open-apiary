<template lang="pug">
  div
    oa-media-library(
      :current-page="currentPage"
      :current-sort="currentSort"
      :current-sort-desc="currentSortDesc"
      :items-per-page="itemsPerPage"
      :pagination="pagination"
      :search.sync="search"
      @update:query="updateQuery"
    )
</template>

<script lang="ts">
/**
 * index
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component
export default class MediaPage extends Vue {
  currentPage = 1;

  currentSort = ['originalFileName'];

  currentSortDesc = ['ASC'];

  itemsPerPage = 25;

  get search() : string {
    if (typeof this.$route.query.q === 'string') {
      return this.$route.query.q ?? '';
    }

    return '';
  }

  set search(search) {
    const query = {
      ...this.$route.query,
      q: search,
    };

    this.$router.push({
      query,
    });
  }

  get pagination() {
    return this.$store.getters['media/pagination'];
  }

  updateQuery(query: never) {
    this.$router.push({
      query,
    });
  }
}
</script>

<style lang="scss" scoped>

</style>

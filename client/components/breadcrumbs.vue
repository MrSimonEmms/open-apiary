<template lang="pug">
  v-breadcrumbs(
    :items="items"
  )
    template( v-slot:divider )
      v-icon mdi-chevron-right

    template( v-slot:item="{ item }" )
      v-breadcrumbs-item(
        nuxt
        exact
        :to="item"
      )
        v-icon(
          v-if="item.name === 'index'"
        ) mdi-home
        span( v-else ) {{ $t(`misc:PAGE_TITLES.${item.name.toUpperCase()}`, item.i18nParams) }}
</template>

<script lang="ts">
/**
 * breadcrumbs
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router'; // eslint-disable-line import/no-extraneous-dependencies

/* Files */

@Component
export default class Breadcrumbs extends Vue {
  get items() {
    /* Use a set to avoid duplications */
    const breadcrumbs = new Set<string>();

    /* Add in the home */
    breadcrumbs.add('index');

    this.$route.matched.forEach((item: RouteRecord) => {
      const path = item.path
        .replace(/\//g, '-')
        .replace(/:/g, '')
        .replace(/^-/, '')
        .replace(/-$/, '');

      if (path !== '') {
        breadcrumbs.add(path);
      }
    });

    return Array.from(breadcrumbs)
      .map((name) => {
        const i18nParams : { [key:string] : any } = {};

        // @todo I don't like this, but I can't see a way of getting dynamic page names in
        if (name === 'apiary-id') {
          i18nParams.name = this.$store.getters['apiary/active']?.name;
        }

        return {
          name,
          i18nParams,
          params: this.$route.params,
        };
      });
  }
}
</script>

<style lang="scss" scoped>

</style>

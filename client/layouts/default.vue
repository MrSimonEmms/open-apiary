<template lang="pug">
  oa-base-layout
    oa-nav-drawer()

    oa-app-bar()

    v-content
      oa-breadcrumbs
      v-container.footer-clearance( fluid )
        nuxt

      oa-footer
</template>

<script lang="ts">
/**
 * default
 */

/* Node modules */

/* Third-party modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component
export default class DefaultLayout extends Vue {}
</script>

<style lang="scss" scoped>
  .footer-clearance {
    padding: {
      bottom: 75px;
    }
  }
</style>

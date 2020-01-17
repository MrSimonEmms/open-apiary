<template lang="pug">
  v-app
    slot
</template>

<script lang="ts">
/**
 * baseLayout
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  head() {
    let title: string | undefined;

    const parsedTitle = this.$store.getters['app/pageTitle'];

    if (parsedTitle) {
      title = this.$i18n.t(parsedTitle);
    }

    return {
      title,
    };
  },
})
export default class BaseLayout extends Vue {}
</script>

<style lang="scss" scoped>

</style>

<template lang="pug">
  v-app-bar(
    app
    flat
    color="grey lighten-5"
  )
    v-app-bar-nav-icon.d-md-none( @click="drawer = !drawer" )

    v-toolbar-title {{ $t(title) }}
</template>

<script lang="ts">
/**
 * appBar
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  watch: {
    $route() {
      this.$log.debug('New route - resetting page title');

      this.$store.commit('app/setPageTitle');
    },
  },
})
export default class AppBar extends Vue {
  get drawer() : boolean | null {
    return this.$store.getters['app/drawerDisplay'];
  }

  set drawer(state: boolean | null) {
    this.$store.commit('app/setDrawerDisplay', state);
  }

  get title() {
    return this.$store.getters['app/pageTitle'];
  }
}
</script>

<style lang="scss" scoped>

</style>

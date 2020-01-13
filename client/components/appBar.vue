<template lang="pug">
  v-app-bar(
    app
    flat
    color="transparent"
  )
    v-app-bar-nav-icon.d-md-none(
      @click="drawer = !drawer"
    )
</template>

<script lang="ts">
/**
 * appBar
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component
export default class AppBar extends Vue {
  get drawer() : boolean | null {
    return this.$store.getters['app/drawerDisplay'];
  }

  set drawer(state: boolean | null) {
    this.$store.commit('app/setDrawerDisplay', state);
  }
}
</script>

<style lang="scss" scoped>

</style>

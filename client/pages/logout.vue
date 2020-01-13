<template lang="pug">
  div logout
</template>

<script lang="ts">
/**
 * logout
 */

/* Node modules */
import { Component, Vue } from 'vue-property-decorator';

/* Files */

@Component({
  layout: 'blank',

  fetch({ redirect, store }) {
    store.commit('user/logout');

    redirect({
      name: 'login',
    });
  },
})
export default class LogoutPage extends Vue {}
</script>

<style lang="scss" scoped>

</style>

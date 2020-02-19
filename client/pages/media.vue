<template lang="pug">
  nuxt-child
</template>

<script lang="ts">
/**
 * media
 */

/* Node modules */
import { Component, Vue } from 'vue-property-decorator';

/* Files */

@Component({
  middleware: [
    'isSetup',
    'isLoggedIn',
  ],
})
export default class Media extends Vue {}
</script>

<style lang="scss" scoped>

</style>

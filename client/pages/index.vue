<template lang="pug">
  div index
</template>

<script lang="ts">
/**
 * index
 */

/* Node modules */

/* Third-party modules */
import { Component, Vue } from 'vue-property-decorator';

/* Files */

@Component({
  middleware: [
    'isLoggedIn',
  ],
})
export default class IndexPage extends Vue {}
</script>

<style lang="scss" scoped>

</style>

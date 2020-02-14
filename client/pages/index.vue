<template lang="pug">
  div
    | @todo - this will be used when I work out what to do. Most likely, this
    | will be how the automated data is collated - things such as weight, temperature,
    | humidity
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
    'isSetup',
    'isLoggedIn',
    ({ redirect }) => {
      redirect({
        name: 'apiary',
      });
    },
  ],
})
export default class IndexPage extends Vue {}
</script>

<style lang="scss" scoped>

</style>

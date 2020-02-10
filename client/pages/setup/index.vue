<template lang="pug">
  .subtitle-2 {{ $t('setup:STEP_1:DESC') }}
</template>

<script lang="ts">
/**
 * index
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component
export default class SetupIndex extends Vue {
  // eslint-disable-next-line class-methods-use-this
  validation() : boolean {
    return true;
  }
}
</script>

<style lang="scss" scoped>

</style>

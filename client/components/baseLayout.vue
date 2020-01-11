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

@Component
export default class BaseLayout extends Vue {}
</script>

<style lang="scss" scoped>

</style>

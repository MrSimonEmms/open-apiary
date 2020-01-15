<template lang="pug">
  v-container( fluid )
    nuxt-child
</template>

<script lang="ts">
/**
 * apiary
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  middleware: [
    'isLoggedIn',
  ],
})
export default class ApiaryPage extends Vue {}
</script>

<style lang="scss" scoped>

</style>

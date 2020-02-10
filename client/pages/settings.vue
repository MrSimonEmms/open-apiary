<template lang="pug">
  div settings wrapper
    nuxt
</template>

<script lang="ts">
/**
 * settings
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  middleware: [
    'isSetup',
    'isLoggedIn',
  ],
})
export default class SettingsPage extends Vue {
}
</script>

<style lang="scss" scoped>

</style>

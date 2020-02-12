<template lang="pug">
  div
    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ error }}

    oa-change-password(
      @error="error = $event"
      stayLoggedIn
    )
</template>

<script lang="ts">
/**
 * users
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component
export default class PasswordSettingsPage extends Vue {
  error: string | null = null;
}
</script>

<style lang="scss" scoped>

</style>

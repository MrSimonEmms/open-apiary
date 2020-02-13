<template lang="pug">
  div
    v-alert(
      v-if="error"
      type="error"
    ) {{ $t('error:SCANNER', { context: error }) }}

    client-only
      qrcode-stream(
        @decode="onDecode"
        @init="onInit"
      )
</template>

<script lang="ts">
/**
 * scanner
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    setPageTitle(): void;
  }
}

@Component({
  created() {
    this.setPageTitle();
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class ScannerPage extends Vue {
  error: string | null = null;

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'misc:PAGE_TITLES.SCANNER');
  }

  async onDecode(uuid: string) {
    try {
      const hive = await this.$store.dispatch('hive/findByUUID', uuid);

      await this.$router.push({
        name: 'apiary-id-hive',
        params: {
          id: hive.apiary.id,
          hive: hive.id,
        },
      });
    } catch (err) {
      this.error = 'NotFound';
    }
  }

  async onInit(promise: Promise<void>) {
    try {
      await promise;
    } catch (err) {
      this.error = err?.name ?? 'GENERAL';
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

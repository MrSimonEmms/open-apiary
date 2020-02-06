<template lang="pug">
  v-app
    slot

    v-snackbar(
      v-for="({ key, message }) in messages"
      :key="key"
      :value="true"
      @input="removeMessage(key)"
      :top="message.top"
      :bottom="message.bottom"
      :left="message.left"
      :right="message.right"
      :timeout="message.timeout"
      :multi-line="message.multiLine"
    ) {{ $t(message.msg) }}
      v-btn(
        color="pink"
        text
        @click="removeMessage(key)"
      ) {{ $t('baseLayout:SNACKBARS:CLOSE') }}
</template>

<script lang="ts">
/**
 * baseLayout
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  head() {
    let title: string | undefined;

    const parsedTitle = this.$store.getters['app/pageTitle'];

    if (parsedTitle) {
      title = this.$i18n.t(parsedTitle);
    }

    return {
      title,
    };
  },
})
export default class BaseLayout extends Vue {
  get messages() {
    return this.$store.getters['app/systemMessages'];
  }

  removeMessage(key: number) {
    this.$store.commit('app/removeSystemMessage', key);
  }
}
</script>

<style lang="scss" scoped>

</style>

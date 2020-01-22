<template lang="pug">
  v-dialog(
    v-model="dialog"
    :max-width="maxWidth"
    @keydown.enter="agree"
    @keydown.esc="cancel"
  )
    v-card
      v-card-title.headline {{ $t(title) }}

      v-card-text(
        v-if="message"
      ) {{ $t(message) }}

      v-card-actions
        v-spacer
        v-btn(
          text
          @click.native="cancel"
        ) {{ $t('misc:CONFIRM.CANCEL_BUTTON') }}

        v-btn(
          color="error"
          @click.native="agree"
        ) {{ $t('misc:CONFIRM.DELETE_BUTTON') }}
</template>

<script lang="ts">
/**
 * confirm
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import { IConfirm } from '../interfaces/app';

/* Files */

@Component
export default class Confirm extends Vue implements IConfirm {
  dialog: boolean = false;

  title: string = '';

  message: string = '';

  resolve?: (value?: boolean | PromiseLike<boolean>) => void;

  reject?: (reason?: any) => void;

  maxWidth: number = 290;

  agree() {
    this.resolve!(true);
    this.reset();
  }

  cancel() {
    this.resolve!(false);
    this.reset();
  }

  open(
    message: string = 'misc:CONFIRM.CONTINUE_TO_DELETE',
    title: string = 'misc:CONFIRM.ARE_YOU_SURE',
  ) : Promise<boolean> {
    if (message) { this.message = message; }
    if (title) { this.title = title; }

    this.dialog = true;

    return new Promise<boolean>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  reset() {
    this.dialog = false;
    this.resolve = undefined;
    this.reject = undefined;
  }
}
</script>

<style lang="scss" scoped>

</style>

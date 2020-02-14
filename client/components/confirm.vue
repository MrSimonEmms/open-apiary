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

      v-card-text(
        v-if="typeWord"
      ) {{ $t('misc:CONFIRM.TYPE_WORD') }}
        v-text-field(
          v-model="word"
          ref="word"
          :rules="[rules.required, rules.equals]"
          required
        )

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
  $refs!: {
    word: any;
  };

  dialog: boolean = false;

  title: string = '';

  message: string = '';

  resolve?: (value?: boolean | PromiseLike<boolean>) => void;

  reject?: (reason?: any) => void;

  maxWidth: number = 290;

  typeWord: boolean = false;

  word: string = '';

  get rules() {
    return {
      equals: (value: string) => {
        const target = this.$i18n.t('misc:CONFIRM.CONFIRM_WORD');
        if (value === target) {
          return true;
        }

        return this.$i18n.t('form:ERRORS.NONMATCH', {
          target,
        });
      },
      required: (value: string) => !!value || this.$i18n.t('form:ERRORS.REQUIRED'),
    };
  }

  agree() {
    if (this.typeWord) {
      const valid = this.$refs.word.validate(true);

      if (!valid) {
        return;
      }
    }

    this.resolve!(true);
    this.reset();
  }

  cancel() {
    this.resolve!(false);
    this.reset();
  }

  open({
    message = 'misc:CONFIRM.CONTINUE_TO_DELETE',
    title = 'misc:CONFIRM.ARE_YOU_SURE',
    typeWord = false,
  }: {
    message?: string;
    title?: string;
    typeWord?: boolean;
  } = {}) : Promise<boolean> {
    this.word = '';

    if (message) { this.message = message; }
    if (title) { this.title = title; }
    this.typeWord = typeWord;

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

<template lang="pug">
  div
    v-card-title.mt-n11.mb-n9.justify-center
      v-avatar(
        color="white"
        size="65"
      )
        img(
          src="/img/icon.png"
        )

    v-card-title.justify-center {{ $t('forgot-password:TITLE') }}

    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ $t(`forgot-password:ERROR.${error}`) }}

    v-card-text
      v-form(
        @keyup.native.enter="submit()"
      )
        v-text-field(
          v-model="emailAddress"
          :error-messages="validator.getErrors('emailAddress')"
          v-on="validator.getEvents('emailAddress')"
          :label="$t('login:FORM.LABEL.EMAIL_ADDRESS')"
          prepend-inner-icon="mdi-account"
          outlined
        )

        v-text-field.d-none(
          v-model="hidden"
        )

    v-card-text
      nuxt-link( :to="{ name: 'login' }" )
        | {{ $t('forgot-password:BUTTONS.LOGIN') }}

    v-card-actions
      v-btn(
        @click="submit()"
        block
        color="primary"
        large
      ) {{ $t('forgot-password:BUTTONS.SUBMIT') }}
</template>

<script lang="ts">
/**
 * forgotten-password
 */

/* Node modules */

/* Third-party modules */
import { Vue, Component } from 'vue-property-decorator';
import { email, required } from 'vuelidate/lib/validators';

/* Files */
import Validation from '../../lib/validation';
import { IValidation } from '../../interfaces/validation';

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    validator: IValidation;
  }
}

@Component({
  layout: 'login',

  middleware: [
    'isSetup',
    'isNotLoggedIn',
  ],

  validations() {
    return this.validator.getValidations();
  },

  created() {
    this.validator = new Validation(this, [{
      name: 'emailAddress',
      validations: {
        required,
        email,
      },
    }]);
  },

  head() {
    return {
      title: this.$i18n.t('forgot-password:TITLE'),
    };
  },
})
export default class ForgottenPasswordPage extends Vue {
  error: string | null = null;

  emailAddress: string = '';

  hidden: string = '';

  async submit() {
    this.error = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      await this.$store.dispatch('user/forgottenPassword', this.emailAddress);

      await this.$router.push({
        name: 'login',
      });
    } catch (err) {
      this.$log.error('Unable to generate forgotten password', {
        err,
      });

      if (err?.response?.status === 400) {
        this.error = 'UNCONFIGURED';
      } else {
        this.error = 'GENERAL';
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

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
          v-model="password"
          :label="$t('login:FORM.LABEL.PASSWORD')"
          :error-messages="validator.getErrors('password')"
          v-on="validator.getEvents('password')"
          type="password"
          outlined
        )

        v-text-field(
          v-model="password2"
          :label="$t('login:FORM.LABEL.PASSWORD_CONFIRM')"
          :error-messages="validator.getErrors('password2')"
          v-on="validator.getEvents('password2')"
          type="password"
          outlined
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
 * :token
 */

/* Node modules */

/* Third-party modules */
import { Vue, Component } from 'vue-property-decorator';
import { minLength, required, sameAs } from 'vuelidate/lib/validators';

/* Files */
import Validation from '../../lib/validation';

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
      name: 'password',
      validations: {
        required,
        minLength: minLength(6),
      },
    }, {
      name: 'password2',
      validations: {
        required,
        sameAsPassword: sameAs('password'),
      },
    }]);
  },

  head() {
    return {
      title: this.$i18n.t('forgot-password:TITLE'),
    };
  },
})
export default class token extends Vue {
  error: string | null = null;

  password: string = '';

  password2: string = '';

  get token() {
    return this.$route.params.token;
  }

  async submit() {
    this.error = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      await this.$store.dispatch('user/updateForgottenPassword', {
        password: this.password,
        token: this.token,
      });

      await this.$router.push({
        name: 'login',
      });
    } catch (err) {
      this.$log.error('Unable change password', {
        err,
      });

      if (err?.response?.status === 401) {
        this.error = 'EXPIRED_TOKEN';
      } else {
        this.error = 'GENERAL';
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

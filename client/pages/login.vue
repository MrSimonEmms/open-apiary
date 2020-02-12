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

    v-card-title.justify-center {{ $t('login:TITLE') }}

    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ $t(`login:ERROR.${error}`) }}

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

        v-text-field(
          v-model="password"
          :error-messages="validator.getErrors('password')"
          v-on="validator.getEvents('password')"
          :label="$t('login:FORM.LABEL.PASSWORD')"
          prepend-inner-icon="mdi-lock"
          type="password"
          outlined
        )

        v-switch(
          v-model="rememberMe"
          :label="$t('login:FORM.LABEL.REMEMBER_ME')"
        )

    v-card-actions
      v-btn(
        @click="submit()"
        block
        color="primary"
        large
      ) {{ $t('login:FORM.BUTTON.LOGIN') }}

</template>

<script lang="ts">
/**
 * login
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import { email, required } from 'vuelidate/lib/validators';

/* Files */
import Validation from '../lib/validation';
import { IValidation } from '../interfaces/validation';

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
    }, {
      name: 'password',
      validations: {
        required,
      },
    }]);
  },

  head() {
    return {
      title: this.$i18n.t('login:TITLE'),
    };
  },
})
export default class LoginPage extends Vue {
  error: string | null = null;

  emailAddress: string = '';

  password: string = '';

  rememberMe: boolean = true;

  validator!: IValidation;

  get expires() {
    return this.$store.getters['user/expires'];
  }

  get token() {
    return this.$store.getters['user/token'];
  }

  get user() {
    return this.$store.getters['user/user'];
  }

  async submit() {
    this.error = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      await this.$store.dispatch('user/login', {
        emailAddress: this.emailAddress,
        password: this.password,
      });

      const target = this.$store.getters['user/redirect'] ?? {
        name: 'index',
      };

      await this.$router.push(target);
    } catch (err) {
      this.$log.error('Unable to login', {
        err,
      });

      if (err?.response?.status === 401) {
        this.error = 'INVALID_LOGIN';
      } else {
        this.error = 'GENERAL';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

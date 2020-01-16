<template lang="pug">
  v-content
    v-container.bg-img.fill-height(
      fluid
      :style="`background-image: url(${backgroundImg})`"
    )
      v-row.ma-0(
        align="center"
        justify="center"
      )
        v-col(
          cols="12"
          sm="8"
          md="4"
          lg="4"
          xl="3"
        )
          v-card(
            outlined
            flat
          )
            v-card-title.mt-n11.mb-n9.justify-center
              v-avatar(
                color="white"
                size="65"
              )
                v-img(
                  height="60px"
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
                  required
                  :error-messages="validator.getErrors('emailAddress')"
                  v-on="validator.getEvents('emailAddress')"
                  :label="$t('login:FORM.LABEL.EMAIL_ADDRESS')"
                  name="emailAddress"
                  prepend-icon="mdi-account"
                )

                v-text-field(
                  v-model="password"
                  required
                  :error-messages="validator.getErrors('password')"
                  v-on="validator.getEvents('password')"
                  :label="$t('login:FORM.LABEL.PASSWORD')"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
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
  layout: 'blank',

  middleware: [
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

  // eslint-disable-next-line class-methods-use-this
  get backgroundImg() {
    /* This must be set in the /client/static/img/login folder - must be in format xxx.jpg */
    const min = 1;
    const max = 5;

    const fileNumber = Math.floor(Math.random() * (max - min + 1) + min)
      .toString()
      .padStart(3, '0');

    return `/img/login/${fileNumber}.jpg`;
  }

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

      await this.$router.replace(target);
    } catch (err) {
      this.$log.error('Unabled to login', {
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
  .bg-img {
    background: {
      size: cover;
      position: center center;
    }
  }
</style>

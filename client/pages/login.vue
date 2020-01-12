<template lang="pug">
  v-content
    v-container.fill-height( fluid )
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
            v-card-title {{ $t('login:TITLE') }}

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
import { Vue } from 'vue-property-decorator';
import { email, required } from 'vuelidate/lib/validators';

/* Files */
import Validation from '../lib/validation';
import { IValidation } from '../interfaces/validation';

declare module 'vue/types/vue' {
  interface Vue {
    validator: IValidation;
  }
}

interface IData {
  error: string | null;
  emailAddress: string;
  password: string;
  validator: Validation,
}

export default Vue.extend({
  layout: 'blank',

  middleware: [
    'isNotLoggedIn',
  ],

  validations() {
    return this.validator.getValidations();
  },

  data() {
    return {
      error: null,
      emailAddress: '',
      password: '',
      rememberMe: true,
      validator: new Validation(this, [{
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
      }]),
    } as IData;
  },

  computed: {
    expires() { return this.$store.getters['user/expires']; },
    token() { return this.$store.getters['user/token']; },
    user() { return this.$store.getters['user/user']; },
  },

  methods: {
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
    },
  },

  head() {
    return {
      title: this.$i18n.t('login:TITLE'),
    };
  },
});
</script>

<style lang="scss" scoped>

</style>

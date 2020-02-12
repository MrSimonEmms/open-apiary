<template lang="pug">
  div
    v-card-title.mt-n11.mb-n9.justify-center
      v-avatar(
        color="white"
        size="65"
      )
        img(
          :src="gravatar({ img: 65 })"
        )

    v-card-title.justify-center {{ $t('changePassword:TITLE') }}

    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ error }}

    v-card-text {{ $t('changePassword:FORCE_CHANGE_PASSWORD') }}

    oa-change-password(
      @error="error = $event"
      block-action
    )
</template>

<script lang="ts">
/**
 * change-password
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import { minLength, required, sameAs } from 'vuelidate/lib/validators';

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
    'isLoggedIn',
  ],

  head() {
    return {
      title: this.$i18n.t('changePassword:TITLE'),
    };
  },

  validate({ redirect, store }) {
    /* Only allow if password must be changed */
    if (!store.getters['user/user'].changeOnLogin) {
      redirect({
        name: 'index',
      });
    }

    return true;
  },

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
})
export default class ChangePassword extends Vue {
  error: string | null = null;

  password: string = '';

  password2: string = '';

  get gravatar() {
    return this.$store.getters['user/gravatar'];
  }
}
</script>

<style lang="scss" scoped>

</style>

<template lang="pug">
  div
    v-form(
      @keyup.native.enter="$emit('submit')"
    )
      v-text-field(
        v-model="name"
        :label="$t('login:FORM.LABEL.NAME')"
        :error-messages="validator.getErrors('name')"
        v-on="validator.getEvents('name')"
        outlined
      )

      v-text-field(
        v-model="emailAddress"
        :label="$t('login:FORM.LABEL.EMAIL_ADDRESS')"
        :error-messages="validator.getErrors('emailAddress')"
        v-on="validator.getEvents('emailAddress')"
        outlined
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
</template>

<script lang="ts">
/**
 * step-2
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import {
  email,
  minLength,
  required,
  sameAs,
} from 'vuelidate/lib/validators';

/* Files */
import { IValidation } from '../../interfaces/validation';
import Validation from '../../lib/validation';

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    validator: IValidation;
  }
}

@Component({
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
      name: 'name',
      validations: {
        required,
      },
    }, {
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
export default class Step2 extends Vue {
  error: string | null = null;

  emailAddress: string = '';

  name: string = '';

  password: string = '';

  password2: string = '';

  async validation() : Promise<boolean> {
    this.error = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return false;
    }

    try {
      await this.$store.dispatch('user/create', {
        emailAddress: this.emailAddress,
        name: this.name,
        password: this.password,
      });

      return true;
    } catch (err) {
      this.$log.error('Unable to login', {
        err,
      });

      if (err?.response?.status === 401) {
        this.error = 'INVALID_LOGIN';
      } else {
        this.error = 'GENERAL';
      }

      return false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

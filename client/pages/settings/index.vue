<template lang="pug">
  div
    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ error }}

    v-card-text
      v-form(
        @keyup.native.enter="submit"
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

    v-card-actions
      v-spacer
      v-btn(
        :loading="loading"
        :disabled="loading"
        large
        color="primary"
        @click="submit"
      ) {{ $t('misc:BUTTONS.SAVE') }}
</template>

<script lang="ts">
/**
 * profile
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';
import {
  email,
  required,
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
        uniqueEmail: async (emailAddress: string) => {
          const users = await this.$store.dispatch('user/list', {
            emailAddress,
            filterActive: true,
          });

          return users.length === 0;
        },
      },
    }, {
      name: 'name',
      validations: {
        required,
      },
    }]);
  },
})
export default class ProfileSettingsPage extends Vue {
  error: string | null = null;

  loading: boolean = false;

  emailAddress: string = this.user.emailAddress;

  name: string = this.user.name;

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

    this.loading = true;

    try {
      await this.$store.dispatch('user/update', {
        name: this.name,
        emailAddress: this.emailAddress,
      });

      this.$store.commit('app/addSystemMessage', 'misc:BUTTONS:SAVED');
    } catch (err) {
      this.$log.error('Unable to update user profile', {
        err,
      });

      this.error = err.message;
    }

    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>

</style>

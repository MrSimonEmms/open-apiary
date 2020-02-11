<template lang="pug">
  div
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

    v-card-actions
      slot( name="actions" )
        v-spacer
        v-btn(
          :block="blockAction"
          :loading="loading"
          :disabled="loading"
          large
          color="primary"
          @click="submit"
        ) {{ $t('misc:BUTTONS.SAVE') }}
</template>

<script lang="ts">
/**
 * changePassword
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { minLength, required, sameAs } from 'vuelidate/lib/validators';

/* Files */
import { IValidation } from '../interfaces/validation';
import Validation from '../lib/validation';

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    validator: IValidation;
  }
}

@Component({
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
  loading: boolean = false;

  password: string = '';

  password2: string = '';

  @Prop({
    type: Boolean,
    default: false,
  })
  blockAction!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  stayLoggedIn!: boolean;

  async submit() : Promise<void> {
    this.$emit('error', null);
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    this.loading = true;

    try {
      await this.$store.dispatch('user/update', {
        password: this.password,
      });

      if (this.stayLoggedIn) {
        this.$store.commit('app/addSystemMessage', 'misc:BUTTONS:SAVED');
      } else {
        await this.$router.push({
          name: 'logout',
        });
      }
    } catch (err) {
      this.$log.error('Unable to change password', {
        err,
      });

      this.$emit('error', err.message);
    }

    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>

</style>

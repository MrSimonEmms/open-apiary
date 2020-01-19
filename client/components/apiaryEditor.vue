<template lang="pug">
  v-card
    v-card-title( v-if="isNew" ) {{ $t('apiary:ITEM.NEW.TITLE') }}
    v-card-title( v-else ) {{ $t('apiary:ITEM.EDIT.TITLE') }}

    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ $t(`apiary:ERROR.${error}`) }}

    v-card-text
      v-form(
        @keyup.native.enter="submit()"
      )
        v-text-field(
          v-model="name"
          :error-messages="validator.getErrors('name')"
          v-on="validator.getEvents('name')"
          :label="$t('apiary:EDITOR.NAME')"
          outlined
        )

    v-card-actions
      v-btn(
        @click="submit()"
        color="primary"
        large
      ) {{ $t('apiary:BUTTONS.SUBMIT') }}
</template>

<script lang="ts">
/**
 * apiary editor
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';

/* Files */
import { ISchema, IValidation } from '../interfaces/validation';
import Validation from '../lib/validation';

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    schema: ISchema[];
    validator: IValidation;
  }
}

@Component({
  validations() {
    return this.validator.getValidations();
  },

  created() {
    this.validator = new Validation(this, this.schema);
  },
})
export default class ApiaryEditor extends Vue {
  error: string | null = null;

  schema: ISchema[] = [{
    name: 'name',
    validations: {
      required,
    },
  }];

  validator!: IValidation;

  get name() {
    return this.$store.getters['apiary/active'].name;
  }

  set name(value: any) {
    this.$store.commit('apiary/updateActive', {
      value,
      key: 'name',
    });
  }

  get isNew() : boolean {
    return !this.id || this.id === 0;
  }

  @Prop({
    type: Number,
  })
  readonly id?: number;

  async submit() {
    this.error = null;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      const saved = await this.$store.dispatch('apiary/save', this.id);

      if (!this.id) {
        /* Redirect to page if creating a new one */
        await this.$router.push({
          name: 'apiary-id',
          params: {
            id: saved.id,
          },
        });
      }
    } catch (err) {
      this.$log.error('Failed to save apiary', {
        err,
      });
      this.error = 'FAILED_TO_SAVE';
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

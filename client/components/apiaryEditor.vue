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

        // Hide as CSS property to prevent enter reloading page
        // @link https://stackoverflow.com/questions/1370021/why-does-forms-with-single-input-field-submit-upon-pressing-enter-key-in-input
        v-text-field.d-none(
          v-model="latitude"
        )

        // Hide as CSS property to prevent enter reloading page
        // @link https://stackoverflow.com/questions/1370021/why-does-forms-with-single-input-field-submit-upon-pressing-enter-key-in-input
        v-text-field.d-none(
          v-model="longitude"
        )

        oa-map-selector(
          v-model="latLong"
          :zoom="zoom"
          :disable-geo-location="!isNew"
        )

    v-card-actions
      v-spacer
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
    latLong: [
      number,
      number,
    ];
    latitude: number;
    longitude: number;
  }
}

@Component({
  validations() {
    return this.validator.getValidations();
  },

  created() {
    this.validator = new Validation(this, this.schema);
  },

  mounted() {
    /* The lat/long may not be set to the active apiary if using default coords */
    this.latLong = [
      this.latitude,
      this.longitude,
    ];
  },
})
export default class ApiaryEditor extends Vue {
  error: string | null = null;

  zoom: number = 15;

  schema: ISchema[] = [{
    name: 'name',
    validations: {
      required,
    },
  }];

  validator!: IValidation;

  get latLong() {
    return [
      this.latitude,
      this.longitude,
    ];
  }

  set latLong([latitude, longitude]: [number, number]) {
    this.$store.commit('apiary/updateActive', {
      value: {
        latitude,
        longitude,
      },
      key: 'location',
    });
  }

  // Default to the BBKA head office
  get latitude() : number {
    return this.apiary?.location?.latitude ?? 52.339600;
  }

  get longitude(): number {
    return this.apiary?.location?.longitude ?? -1.524890;
  }

  get name() {
    return this.apiary?.name;
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

  get apiary() {
    return this.$store.getters['apiary/active'];
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

      this.$store.commit('app/addSystemMessage', 'misc:BUTTONS:SAVED');

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

<template lang="pug">
  v-card
    v-card-title( v-if="isNew" ) {{ $t('hive:CREATE.TITLE') }}
    v-card-title( v-else ) {{ $t('hive:EDIT.TITLE') }}

    v-card-text( v-if="error" )
      v-alert( type="error" ) {{ error }}

    v-form(
      @keyup.native.enter="submit()"
    )
      v-card-text
        v-dialog(
          ref="establishedDateDialog"
          v-model="establishedDateDialog"
          persistent
          :return-value.sync="value.establishedDate"
          transition="scale-transition"
          max-width="290px"
          @keydown.esc="establishedDateDialog = false"
        )
          template( v-slot:activator="{ on }" )
            v-text-field(
              v-model="establishedDate"
              :label="$t('hive:FORM.ESTABLISHED_DATE')"
              :error-messages="validator.getErrors('establishedDate')"
              v-on="{ ...on, ...validator.getEvents('establishedDate') }"
              prepend-icon="mdi-calendar"
              readonly
            )
          v-date-picker(
            :value="value.establishedDate"
            @input="update('establishedDate', $event)"
            :max="today | datetime('yyyy-LL-dd')"
            scrollable
          )
            v-spacer
            v-btn(
              text
              color="primary"
              @click="establishedDateDialog = false"
            ) {{ $t('apiary:EDITOR.BUTTONS.CANCEL') }}
            v-btn(
              text
              color="primary"
              @click="$refs.establishedDateDialog.save(value.establishedDate)"
            ) {{ $t('apiary:EDITOR.BUTTONS.OK') }}

        v-card-text
          oa-markdown-editor(
            :value="value.origin || ''"
            @input="update('origin', $event)"
            label="hive:FORM.ORIGIN"
          )

      v-card-text
        p( v-if="value.uuid" )
          v-btn(
            color="red lighten-2"
            dark
            @click="generateHiveDoc()"
          )
            v-icon(
              left
            ) mdi-qrcode
            | {{ $t('hive:FORM.LAUNCH_DOCUMENT') }}

        p( v-if="value.apiaryCount" )
          strong {{ $t('hive:FORM.APIARY_COUNT') }}:&nbsp;
          span {{ value.apiaryCount }}
        p( v-if="value.uuid" )
          strong {{ $t('hive:FORM.UUID') }}:&nbsp;
          span {{ value.uuid }}
        p( v-if="value.createdAt" )
          strong {{ $t('misc:FORM.CREATED_AT') }}:&nbsp;
          span {{ value.createdAt | datetime('DATETIME_FULL') }}
        p( v-if="value.updatedAt" )
          strong {{ $t('misc:FORM.UPDATED_AT') }}:&nbsp;
          span {{ value.updatedAt | datetime('DATETIME_FULL') }}

      v-card-actions
        v-spacer
        v-btn(
          :loading="loading"
          :disable="loading"
          color="primary"
          large
          @click="submit()"
        ) {{ $t('hive:FORM.SAVE') }}
</template>

<script lang="ts">
/**
 * hiveEditor
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';

/* Files */
import { IHive } from '../../server/apiary/interfaces/apiary';
import { IValidation } from '../interfaces/validation';
import Validation from '../lib/validation';
import Barcode from '../lib/barcode';

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

  async created() {
    this.validator = new Validation(this, [{
      name: 'establishedDate',
      validations: {
        required,
      },
    }]);
  },
})
export default class HiveEditor extends Vue {
  error: string | null = null;

  loading: boolean = false;

  @Prop({
    type: Number,
    required: true,
  })
  apiaryId!: number;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  value!: IHive | { [key: string] : any };

  establishedDateDialog: boolean = false;

  today: Date = new Date();

  get isNew() {
    if (this.value) {
      return !this.value.id;
    }

    return true;
  }

  get apiary() {
    return this.$store.getters['apiary/active'];
  }

  get establishedDate() {
    return this.value.establishedDate;
  }

  set establishedDate(date: string) {
    Vue.set(this.value, 'establishedDate', date);
  }

  async generateHiveDoc() {
    const barcode = new Barcode(this.apiary, [this.value as IHive], this.$i18n);

    await barcode.generatePDF();
  }

  async submit() {
    this.error = null;
    this.loading = true;
    const valid = this.validator.validate();

    if (!valid) {
      /* Don't continue - form in invalid state */
      return;
    }

    try {
      const hiveId = await this.$store.dispatch('hive/save', {
        apiaryId: this.apiaryId,
        hive: this.value,
      });

      await this.$router.push({
        name: 'apiary-id-hive-edit',
        params: {
          hive: hiveId,
        },
      });
    } catch (err) {
      this.$log.error('Error saving hive', {
        err,
      });

      this.error = err;
    }

    this.loading = false;
  }

  update(key: string, value: any) {
    if (this.isNew) {
      Vue.set(this.value, key, value);
    } else {
      const obj = {
        ...this.value,
        [key]: value,
      };

      this.$emit('input', obj);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

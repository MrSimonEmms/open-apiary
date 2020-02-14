<template lang="pug">
  v-card
    v-toolbar( dark color="primary" )
      v-btn(
        icon
        dark
        @click="$emit('close')"
      )
        v-icon mdi-close

      v-toolbar-title( v-if="id === 0" ) {{ $t('apiary:INSPECTIONS.FORM.TITLE.NEW') }}
      v-toolbar-title( v-else ) {{ $t('apiary:INSPECTIONS.FORM.TITLE.EDIT') }}
      v-spacer
      v-toolbar-items
        v-btn(
          dark
          text
          :disabled="saving"
          :loading="saving"
          @click="save"
        ) {{ $t('apiary:EDITOR.BUTTONS.SAVE') }}

    v-card-text
      v-container( fluid )
        v-row( v-if="error" )
          v-col( cols="12" )
            v-alert( type="error" ) {{ error }}

        v-row
          v-col( cols="12" md="6" lg="4" )
            v-dialog(
              ref="datetimeDialog"
              v-model="datetimeDialog"
              persistent
              :return-value.sync="value.date"
              transition="scale-transition"
              max-width="290px"
              @keydown.esc="datetimeDialog = false"
            )
              template( v-slot:activator="{ on }" )
                v-text-field(
                  v-model="value.date"
                  :label="$t('apiary:INSPECTIONS.FORM.DATE')"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                )
              v-date-picker(
                v-model="value.date"
                :max="today | datetime('yyyy-LL-dd')"
                scrollable
              )
                v-spacer
                v-btn(
                  text
                  color="primary"
                  @click="datetimeDialog = false"
                ) {{ $t('apiary:EDITOR.BUTTONS.CANCEL') }}
                v-btn(
                  text
                  color="primary"
                  @click="$refs.datetimeDialog.save(value.date)"
                ) {{ $t('apiary:EDITOR.BUTTONS.OK') }}

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.QUEEN') }}

          v-col( cols="12" md="6" lg="4" )
            v-switch(
              v-model="value.queen.seen"
              :label="$t('apiary:INSPECTIONS.FORM.QUEEN_SEEN')"
            )
          v-col(
            cols="12" md="6" lg="4"
            v-if="value.queen.seen"
          )
            v-switch(
              v-model="value.queen.clipped"
              :label="$t('apiary:INSPECTIONS.FORM.QUEEN_CLIPPED')"
            )
          v-col(
            cols="12" md="6" lg="4"
            v-if="value.queen.seen"
           )
            v-select(
              v-model="value.queen.marked"
              :label="$t('apiary:INSPECTIONS.FORM.QUEEN_MARKED')"
              :items="queenMarkingColors"
            )
              template( v-slot:selection="{ item }" )
                v-avatar.queen-marking.mr-2(
                  v-if="item.color"
                  tile
                  :size="16"
                  :color="item.color"
                )
                span {{ $t(`apiary:INSPECTIONS.FORM.MARKING.${item.text}`) }}

              template( v-slot:item="{ item }" )
                v-avatar.queen-marking.mr-2(
                  v-if="item.color"
                  tile
                  :size="16"
                  :color="item.color"
                )
                span {{ $t(`apiary:INSPECTIONS.FORM.MARKING.${item.text}`) }}

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.QUEEN_CELL.TITLE') }}

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.queenCell.removed"
              :min="0"
              label="apiary:INSPECTIONS.FORM.QUEEN_CELL.REMOVED"
            )

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.queenCell.left"
              :min="0"
              label="apiary:INSPECTIONS.FORM.QUEEN_CELL.LEFT"
            )

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.BROOD.TITLE') }}

          v-col( cols="12" md="6" lg="4" )
            v-switch(
              v-model="value.brood.eggs"
              :label="$t('apiary:INSPECTIONS.FORM.BROOD.EGGS')"
            )

          v-col( cols="12" md="6" lg="4" )
            v-switch(
              v-model="value.brood.pattern"
              :label="$t('apiary:INSPECTIONS.FORM.BROOD.PATTERN_OK')"
            )

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.brood.frames"
              :min="0"
              label="apiary:INSPECTIONS.FORM.BROOD.FRAMES"
            )

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.WEATHER.TITLE') }}

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.weather.temp"
              label="apiary:INSPECTIONS.FORM.WEATHER.TEMP"
            )

          v-col( cols="12" md="6" )
            v-btn-toggle(
              v-model="value.weather.desc"
              mandatory
            )
              v-btn(
                v-for="(icon, weather) in weatherOpts"
                :key="weather"
                :value="weather"
              )
                span.hidden-sm-and-down.pr-2
                  | {{ $t(`apiary:INSPECTIONS.FORM.WEATHER.${weather}`) }}
                v-icon( ) {{ icon }}

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.HEALTH.TITLE') }}

          v-col( cols="12" md="6" lg="4" )
            v-switch(
              v-model="value.health.ok"
              :label="$t('apiary:INSPECTIONS.FORM.HEALTH.OK')"
            )

          v-col( cols="12" md="6" lg="4" )
            div {{ $t('apiary:INSPECTIONS.FORM.HEALTH.VARROA') }}
            v-btn-toggle(
              v-model="value.varroa"
              mandatory
            )
              v-btn(
                v-for="(level, key) in varroaLevels"
                :key="key"
                :value="level"
              ) {{ $t('apiary:INSPECTIONS.FORM.HEALTH.LEVEL', { context: level }) }}

          v-col( cols="12" md="6" lg="4" )
            v-combobox(
              v-model="value.health.diseases"
              :label="$t('apiary:INSPECTIONS.FORM.HEALTH.DISEASES')"
              :hint="$t('apiary:INSPECTIONS.FORM.HEALTH.DISEASES_HINT')"
              :items="diseaseList"
              multiple
              chips
              small-chips
              clearable
            )
              template( v-slot:selection="data" )
                v-chip(
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  @click:close="data.parent.selectItem(data.item)"
                  small
                )
                  v-chip.ml-n2.mr-2(
                    color="primary"
                    x-small
                  ) {{ getDiseaseAbbreviation(data.item) }}
                  | {{ data.item }}

          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.FEED.TITLE') }}

        v-row(
          v-for="(feed, key) in value.feed"
          :key="key"
        )
          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="feed.quantity"
              :min="0"
              label="apiary:INSPECTIONS.FORM.FEED.QUANTITY"
            )

          v-col( cols="12" md="6" lg="4" )
            v-combobox(
              v-model="feed.type"
              v-if="feed.quantity > 0"
              :label="$t('apiary:INSPECTIONS.FORM.FEED.TYPE')"
              :items="feedTypes"
              chips
              hide-selected
              small-chips
              clearable
            )
              template( v-slot:selection="data" )
                v-chip(
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  small
                  @click:close="data.parent.selectItem(data.item)"
                )
                  v-chip.ml-n2.mr-2(
                    color="primary"
                    x-small
                  ) {{ getFeedAbbreviation(data.item) }}
                  | {{ data.item }}

        v-row
          v-col.py-0( cols="12" )
            .subtitle-1 {{ $t('apiary:INSPECTIONS.FORM.GENERAL.TITLE') }}

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.stores"
              :min="0"
              label="apiary:INSPECTIONS.FORM.GENERAL.STORES"
            )

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.room"
              :min="0"
              label="apiary:INSPECTIONS.FORM.GENERAL.ROOM"
            )

          v-col( cols="12" md="6" lg="4" )
            oa-number-selector(
              v-model="value.temper"
              label="apiary:INSPECTIONS.FORM.GENERAL.TEMPER"
              hint="apiary:INSPECTIONS.FORM.GENERAL.TEMPER_HINT"
              :min="0"
              :max="10"
            )

          v-col( cols="12" )
            oa-markdown-editor(
              v-model="value.notes"
              placeholder="apiary:INSPECTIONS.FORM.NOTES.TITLE"
            )

        v-row( v-if="value.createdAt && value.updatedAt" )
          v-col.py-0( cols="12" md="6" )
            strong {{ $t('misc:FORM.CREATED_AT') }}:&nbsp;
            span {{ value.createdAt | datetime('DATETIME_FULL') }}
          v-col.py-0( cols="12" md="6" )
            strong {{ $t('misc:FORM.UPDATED_AT') }}:&nbsp;
            span {{ value.updatedAt | datetime('DATETIME_FULL') }}
</template>

<script lang="ts">
/**
 * inspectionEditor
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */

@Component
export default class InspectionEditor extends Vue {
  datetimeDialog: boolean = false;

  get diseaseList() : string[] {
    return [
      this.$i18n.t('apiary:INSPECTIONS.FORM.HEALTH.LIST.AMERICAN_FOUL_BROOD'),
      this.$i18n.t('apiary:INSPECTIONS.FORM.HEALTH.LIST.EURO_FOUL_BROOD'),
      this.$i18n.t('apiary:INSPECTIONS.FORM.HEALTH.LIST.CHALK_BROOD'),
      this.$i18n.t('apiary:INSPECTIONS.FORM.HEALTH.LIST.NOSEMA'),
    ].sort();
  }

  error: string | null = null;

  get feedTypes() : string[] {
    return [
      this.$i18n.t('apiary:INSPECTIONS.FORM.FEED.FONDANT'),
      this.$i18n.t('apiary:INSPECTIONS.FORM.FEED.LIGHT_SYRUP'),
      this.$i18n.t('apiary:INSPECTIONS.FORM.FEED.HEAVY_SYRUP'),
    ].sort();
  }

  queenMarkingColors: any[] = [{
    text: 'NO',
    value: false,
  }, {
    text: 'YES',
    value: true,
  }, {
    color: 'white',
    text: 'WHITE',
    value: 'white',
  }, {
    color: 'yellow',
    text: 'YELLOW',
    value: 'yellow',
  }, {
    color: 'red',
    text: 'RED',
    value: 'red',
  }, {
    color: 'green',
    text: 'GREEN',
    value: 'green',
  }, {
    color: 'blue',
    text: 'BLUE',
    value: 'blue',
  }];

  saving: boolean = false;

  varroaLevels: string[] = [
    'L',
    'M',
    'H',
  ];

  @Prop({
    type: Number,
    default: 0,
  })
  id!: number;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  today!: Date;

  @Prop({
    type: Object,
    required: true,
  })
  value!: any;

  @Prop({
    type: Object,
    required: true,
  })
  weatherOpts!: { [key: string] : string; };

  getDiseaseAbbreviation(disease: string) {
    return this.$store.getters['hive/getAbbreviation'](disease);
  }

  getFeedAbbreviation(feed: string) {
    return this.$store.getters['hive/getAbbreviation'](feed, false);
  }

  async save() {
    Vue.set(this, 'saving', true);
    Vue.set(this, 'error', null);

    const data = {
      ...this.value,
      // If no feed quantity, remove the type
      feed: this.value.feed.map(({ id, quantity, type }: {
        id?: number,
        quantity: number,
        type?: string,
      }) => ({
        id,
        quantity,
        type: quantity === 0 ? undefined : type,
      })),
    };

    const apiaryId = Number(this.$route.params.id);
    const hiveId = Number(this.$route.params.hive);

    const payload = {
      data,
      apiaryId,
      hiveId,
      id: this.id,
    };

    try {
      await this.$store.dispatch('hive/saveInspection', payload);

      /* Reload */
      await this.$store.dispatch('hive/inspections', {
        apiaryId,
        hiveId,
        page: this.$route.query.page,
        limit: this.$route.query.limit,
      });

      this.$emit('close');
    } catch (err) {
      Vue.set(this, 'error', err.message);

      this.$log.error('Error saving inspection', {
        err,
        payload,
      });
    } finally {
      Vue.set(this, 'saving', false);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

import { IWeatherTypes } from '../../../../../server/apiary/interfaces/apiary';
<template lang="pug">
  div
    oa-confirm( ref="confirm" )
    oa-new-button(
      :buttons="speedDial"
      open-icon="mdi-settings"
    )
    v-dialog(
      v-model="editor"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    )
      oa-inspection-editor(
        v-model="editData"
        :id="editId"
        :weather-opts="weatherOpts"
        @close="editor = false"
      )

    v-card
      v-card-title
        v-btn(
          color="primary"
          :disabled="inspectionLoading"
          :loading="inspectionLoading"
          @click="editItem({ id: 0 })"
        ) {{ $t('apiary:INSPECTIONS.FORM.TITLE.NEW') }}
        v-spacer
        v-text-field(
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('apiary:INSPECTIONS.SEARCH')"
          single-line
          hide-details
          clearable
        )

      v-data-table(
        :headers="headers"
        :items="inspectionData"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        :sort-by="currentSort"
        :loading="loading"
        @update:options="reload"
        :sort-desc="currentSortDesc"
        :server-items-length="inspectionPagination.total"
        :footer-props="{ \
          itemsPerPageOptions: [10, 25, 50, 100, -1], \
          itemsPerPageText: $t('misc:PAGING.ITEMS_PER_PAGE_TEXT') + ':' \
        }"
        item-key="id"
        hide-default-header
        :no-data-text="$t('apiary:INSPECTIONS.NO_DATA')"
        :no-results-text="$t('apiary:INSPECTIONS.NO_RESULTS')"
      )
        template( v-slot:header="{ on, props: { headers, options } }" )
          thead.d-none.d-table-header-group
            tr
              th.text-center(
                :class="{ sortable: item.sortable }"
                v-for="(item, key) in headers"
                :key="key"
                v-on="{ click: item.sortable ? () => on.sort(item.value) : () => {} }"
              ) {{ $t(item.text) }}
                v-icon(
                  v-if="getSortStatus(item.value, options.sortBy, options.sortDesc) === 1"
                  color="black"
                  size="18"
                ) mdi-arrow-up
                v-icon(
                  v-if="getSortStatus(item.value, options.sortBy, options.sortDesc) === -1"
                  color="black"
                  size="18"
                ) mdi-arrow-down

        template( v-slot:item.date="{ item }" ) {{ item.date | datetime('yyyy-LL-dd') }}

        template( v-slot:item.queen="{ item }" )
          div( v-if="item.queen" )
            span( v-if="item.queen.seen" ) &#10004;
            span( v-else ) &#10005;
            .sm-line-break
            span( v-if="item.queen.clipped" ) {{ $t('apiary:INSPECTIONS.ABBREV.CLIPPED') }}
            .sm-line-break
            span( v-if="item.queen.marked" )
              span(
                v-if="item.queen.marked === true"
              ) {{ $t('apiary:INSPECTIONS.ABBREV.MARKED') }}
              v-avatar.queen-marking(
                v-else
                tile
                :size="16"
                :color="item.queen.marked"
              )
          div( v-else ) &#10005;

        template( v-slot:item.queenCell="{ item }" )
          div( v-if="item.queenCell" )
            span( v-if="item.queenCell.removed + item.queenCell.left === 0" ) &#10005;
            span( v-if="item.queenCell.removed > 0" )
              | {{ $t('apiary:INSPECTIONS.ABBREV.QUEEN_CELLS_REMOVED',
              | { count: item.queenCell.removed }) }}
              .sm-line-break
            span( v-if="item.queenCell.left > 0" )
              | {{ $t('apiary:INSPECTIONS.ABBREV.QUEEN_CELLS_LEFT',
              | { count: item.queenCell.left }) }}
          div( v-else ) &#10005;

        template( v-slot:item.brood="{ item }" )
          div( v-if="item.brood" )
            span( v-if="item.brood.pattern" ) &#10004;
            span( v-else ) &#10005;
            .sm-line-break
            span( v-if="item.brood.eggs" ) {{ $t('apiary:INSPECTIONS.ABBREV.EGGS') }}
              .sm-line-break
            span( v-if="item.brood.frames > 0") {{ item.brood.frames }}
          div( v-else ) &#10005;

        template( v-slot:item.stores="{ item }" ) {{ item.stores || 0 }}

        template( v-slot:item.room="{ item }" ) {{ item.room || 0 }}

        template( v-slot:item.health="{ item }" )
          div( v-if="item.health" )
            span( v-if="item.health.ok === true") &#10004;
              .sm-line-break
            span(
              v-for="(disease, key) in item.health.diseases"
              :key="key"
            ) {{ getDiseaseAbbreviation(disease) }}
              .sm-line-break(
                v-if="(key + 1) < item.health.diseases.length"
              )

          div( v-else) -

        template( v-slot:item.varroa="{ item }" )
          span( v-if="item.varroa" )
            | {{ $t('apiary:INSPECTIONS.ABBREV.VARROA', { context: item.varroa }) }}
          span( v-else ) -

        template( v-slot:item.temper="{ item }" ) {{ item.temper || '-' }}

        template( v-slot:item.feed="{ item }" )
          div( v-if="item.feed && item.feed.length > 0" )
            span(
              v-for="(feed, key) in item.feed"
              :key="key"
            )
              span( v-if="feed.quantity === 0" ) -
              span( v-else )
                | {{ $t('apiary:INSPECTIONS.ABBREV.FEED',
                | { count: feed.quantity, abbrev: getFeedAbbreviation(feed.type) }) }}
                .sm-line-break(
                  v-if="(key + 1) < item.feed.length"
                )
          div( v-else) -

        template( v-slot:item.supers="{ item }" )
          span( v-if="item.supers > 0" ) &plus;{{ item.supers }}
          span( v-else-if="item.supers < 0" ) {{ item.supers }}
          span( v-else ) -

        template( v-slot:item.weather="{ item }" )
          div( v-if="item.weather" )
            span( v-if="item.weather.desc && weatherOpts[item.weather.desc]" )
              v-icon {{ weatherOpts[item.weather.desc] }}
              .sm-line-break
            span {{ item.weather.temp }}&deg;C
          div( v-else) -

        template( v-slot:item.notes="{ item }" )
          .notes.text-left.ml-2(
            v-if="item.notes"
            v-dompurify-html="$options.filters.markdown(item.notes)"
          )
          span( v-else ) -

        template( v-slot:item.action_buttons="{ item }" )
          .text-no-wrap
            v-btn(
              text
              icon
              color="primary"
              @click.stop.prevent="editItem(item)"
            )
              v-icon mdi-pencil
            v-btn(
              text
              icon
              color="error"
              @click.stop.prevent="deleteItem(item)"
            )
              v-icon mdi-delete

        template( v-slot:footer.page-text="item" )
          div {{ $t('misc:PAGING.PAGE_TEXT', item) }}
</template>

<script lang="ts">
/**
 * test
 */

/* Node modules */
import { Component, Vue } from 'vue-property-decorator';
import { cloneDeep, debounce } from 'lodash';

/* Files */
import datetime from '../../../../filters/datetime';
import { IInspection, IWeatherTypes } from '../../../../../server/apiary/interfaces/apiary';
import { IButton } from '../../../../interfaces/newButton';

declare module 'vue/types/vue' {
  interface Vue {
    setPageTitle(): void;
  }
}

@Component({
  created() {
    this.setPageTitle();
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class HiveIndexPage extends Vue {
  $refs!: {
    confirm: any;
  };

  loading: boolean = false;

  inspectionLoading: boolean = false;

  speedDial: IButton[] = [{
    color: 'warning',
    icon: 'mdi-settings',
    to: {
      name: 'apiary-id-hive-edit',
    },
  }, {
    color: 'red',
    icon: 'mdi-delete',
    click: async (event) => {
      event.stopPropagation();

      await this.deleteHive();
    },
  }];

  defaultInspection: Omit<IInspection, 'hive' | 'updatedAt' | 'createdAt' | 'id'> = {
    date: new Date(),
    queen: {
      seen: true,
      clipped: false,
      marked: false,
    },
    queenCell: {
      removed: 0,
      left: 0,
    },
    brood: {
      eggs: true,
      pattern: true,
      frames: 0,
    },
    stores: 0,
    room: 0,
    health: {
      ok: true,
      diseases: [],
    },
    varroa: 'L',
    temper: 10,
    feed: [{
      quantity: 0,
      type: 'LS',
    }],
    weather: {
      temp: 12,
      desc: IWeatherTypes.FAIR,
    },
    supers: 0,
    notes: '',
  };

  editData: any = this.defaultInspection; // Use default inspection data on load

  editId: number = 0;

  editor: boolean = false;

  get search() : string | null {
    if (typeof this.$route.query.q === 'string') {
      return this.$route.query.q ?? '';
    }

    return '';
  }

  set search(search) {
    this.filterResults(search === null ? '' : search);
  }

  async deleteHive() {
    this.$log.debug('Hive delete confirmation requested');

    const confirm = await this.$refs.confirm.open({
      typeWord: true,
    });

    if (!confirm) {
      this.$log.debug('Hive delete cancelled');
      return;
    }

    await this.$store.dispatch('hive/delete', {
      apiaryId: this.$route.params.id,
      hiveId: this.$route.params.hive,
    });

    await this.$router.push({
      name: 'apiary-id',
    });
  }

  get hive() {
    return this.$store.getters['hive/active'] ?? {};
  }

  setPageTitle() {
    this.$store.commit('app/setPageTitle', this.$i18n.t('misc:PAGE_TITLES.APIARY-ID-HIVE', {
      number: this.hive.apiaryCount,
    }));
  }

  weatherOpts: { [key: string]: string } = {
    CLOUD: 'mdi-weather-cloudy',
    FAIR: 'mdi-weather-partly-cloudy',
    HAIL: 'mdi-weather-hail',
    RAIN: 'mdi-weather-rainy',
    SNOW: 'mdi-weather-snowy',
    STORM: 'mdi-weather-lightning-rainy',
    SUN: 'mdi-weather-sunny',
  };

  get headers() {
    return [
      'date',
      'queen',
      'queenCell',
      'brood',
      'stores',
      'room',
      'health',
      'varroa',
      'temper',
      'feed',
      'supers',
      'weather',
      'notes',
      'action_buttons',
    ].map((value) => ({
      value,
      text: this.getHeadingText(value),
      align: 'center',
      sortable: value === 'date',
    }));
  }

  get inspectionData() {
    return this.$store.getters['hive/inspections'];
  }

  get inspectionPagination() {
    return this.$store.getters['hive/inspectionPagination'];
  }

  async deleteItem(item: { id: number }) {
    this.$log.debug('Inspection delete confirmation requested');

    const confirm = await this.$refs.confirm.open();

    if (!confirm) {
      this.$log.debug('Inspection delete cancelled');
      return;
    }

    const data = {
      apiaryId: this.$route.params.id,
      hiveId: this.$route.params.hive,
      inspectionId: item.id,
    };

    this.$log.info('Deleting hive inspection', data);

    await this.$store.dispatch('hive/deleteInspection', data);
  }

  async editItem(item: { id: number }) {
    /* Clone the data */
    const defaultInspection = cloneDeep(this.defaultInspection);

    const isNew = item.id === 0;

    const data = isNew ? defaultInspection : cloneDeep(item);

    if (isNew) {
      /* Load the weather */
      Vue.set(this, 'inspectionLoading', true);
      const apiaryId = this.$route.params.id;

      const weather = await this.$store.dispatch('apiary/weather', apiaryId);

      Vue.set(data, 'weather', weather);

      Vue.set(this, 'inspectionLoading', false);
    }

    Vue.set(this, 'editData', {
      ...defaultInspection, // Fill in any missing items
      ...data,
    });
    Vue.set(this, 'editId', item.id);
    Vue.set(this, 'editor', true);
    this.editData.date = datetime(this.editData.date, 'yyyy-LL-dd');
  }

  getDiseaseAbbreviation(disease: string) {
    return this.$store.getters['hive/getAbbreviation'](disease);
  }

  getFeedAbbreviation(feed: string) {
    return this.$store.getters['hive/getAbbreviation'](feed, false);
  }

  getHeadingText(key: string) : string {
    return this.$i18n.t(`apiary:INSPECTIONS.HEADINGS.${key.toUpperCase()}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getSortStatus(key: string, sortBy: string[], sortDesc: boolean[]) {
    const index = sortBy.findIndex((item) => item === key);

    if (index >= 0) {
      /* This key is being sorted - is it descending? */
      const isDesc = sortDesc[index];

      return isDesc ? -1 : 1;
    }

    return 0;
  }

  get itemsPerPage() {
    return Number(this.$route.query.limit ?? 5);
  }

  get currentPage() {
    return Number(this.$route.query.page ?? 1);
  }

  get currentSort() {
    const col = this.$route.query.sort ?? 'date';

    const arr = [];

    if (col) {
      arr.push(col);
    }

    return arr;
  }

  get currentSortDesc() {
    const dir = this.$route.query.sortDir ?? 'DESC';

    const arr = [];

    if (dir && dir === 'DESC') {
      arr.push(true);
    }

    return arr;
  }

  filterResults(search: string) {
    return debounce(async () => {
      const sortBy: any = this.currentSort;

      await this.reload({
        search,
        sortBy,
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        sortDesc: this.currentSortDesc,
      });

      const query = {
        ...this.$route.query,
        q: search,
      };

      await this.$router.push({
        query,
      });
    }, 500)();
  }

  async reload(opts: {
    page: number;
    itemsPerPage: number;
    sortBy: string[];
    sortDesc: boolean[];
    search?: string;
  }) {
    Vue.set(this, 'loading', true);

    const { page, itemsPerPage: limit } = opts;

    /* Only support single column sorting */
    const sort = opts.sortBy[0];
    const sortDir = opts.sortDesc[0] ? 'DESC' : 'ASC';

    try {
      await this.$store.dispatch('hive/inspections', {
        page,
        limit,
        sort,
        sortDir,
        search: opts.search ?? this.search,
        apiaryId: this.$route.params.id,
        hiveId: this.$route.params.hive,
      });

      const query = {
        ...this.$route.query,
        sort,
        sortDir,
        page: page.toString(),
        limit: limit.toString(),
      };

      await this.$router.push({
        query,
      });
    } catch (err) {
      this.$log.warn('Failed to reload inspections', {
        err,
      });
    }

    Vue.set(this, 'loading', false);
  }
}
</script>

<style lang="scss">
  @import '~vuetify/src/styles/main.sass';

  .sm-line-break {
    @extend .d-inline-block;
    @extend .d-sm-block;

    @media (max-width: map-get($grid-breakpoints, 'sm')) {
      margin: {
        right: $spacer * 2;
      }
    }
  }
</style>

<style lang="scss" slot-scope="body">
  @import '~vuetify/src/styles/main.sass';

  @media (min-width: map-get($grid-breakpoints, 'sm')) {
    .v-application .d-table-header-group {
      display: table-header-group !important;
    }
  }

  .text-center input {
    text: {
      align: center;
    }
  }

  th.sortable {
    &:hover {
      cursor: pointer;
    }
  }

  .v-application .queen-marking {
    border: {
      color: map-get($grey, 'base') !important;
      style: solid;
      width: 1px;
    }
  }

  .notes {
    /* This keeps it on one line */
    p:last-of-type {
      margin: {
        bottom: 0;
      }
    }
  }
</style>

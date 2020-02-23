<template lang="pug">
  div
    oa-confirm( ref="confirm" )

    v-card
      v-form(
        @keyup.native.enter="upload()"
      )
        v-card-text
          v-file-input(
            v-model="file"
            :label="$t('media:FORM.FILE')"
            show-size
            accept="image/png, image/jpeg, image/gif"
            :rules="rules"
            chips
            prepend-icon="mdi-folder-multiple-image"
          )

        v-card-actions
          v-spacer
          v-btn(
            color="primary"
            @click="upload()"
            large
          ) {{ $t('media:FORM.BUTTONS.UPLOAD') }}

    v-card.mt-2
      v-card-title
        v-btn(
          v-if="!select && selected.length > 0"
          color="error"
          @click="deleteFiles()"
        ) {{ $t('media:FORM.BUTTONS.DELETE' ) }}

        v-btn(
          v-if="select"
          color="primary"
          :disabled="selectDisabled"
          @click="selectFiles()"
        ) {{ $t('media:FORM.BUTTONS.SELECT' ) }}

        v-spacer
        v-text-field(
          :value="search"
          @input="updateSearch"
          append-icon="mdi-magnify"
          :label="$t('apiary:INSPECTIONS.SEARCH')"
          single-line
          hide-details
          clearable
        )

      v-card-text
        v-data-table(
          v-model="selected"
          :single-select="select && !isMultiple"
          :headers="headers"
          :items="mediaList"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :sort-by="currentSort"
          :sort-desc="currentSortDesc"
          @update:options="reload"
          show-select
          :server-items-length="pagination.total"
          :no-data-text="$t('media:TABLE.NO_DATA')"
          :no-results-text="$t('media:TABLE.NO_RESULTS')"
          :loading-text="$t('misc:TABLE:LOADING')"
          :footer-props="{ \
            itemsPerPageOptions: itemsPerPageOptions, \
            itemsPerPageText: $t('misc:PAGING.ITEMS_PER_PAGE_TEXT') + ':' \
          }"
        )
          template( v-slot:item.preview="{ item }" )
            v-dialog(
              v-model="preview[item.id]"
            )
              template( v-slot:activator="{ on }" )
                .d-flex.justify-center
                  v-img.my-2.hover-click(
                    :src="`/api/media/${item.id}`"
                    max-width="200"
                    v-on="on"
                  )

              v-toolbar( flat dark color="primary" )
                v-btn(
                  icon
                  dark
                  @click="preview[item.id] = false"
                )
                  v-icon mdi-close

              img( :src="`/api/media/${item.id}`" )

          template( v-slot:item.user="{ value }" )
            span( v-if="value") {{ value.name || '-' }}
            span( v-else ) -

          template( v-slot:item.size="{ value }" ) {{ getHumanFileSize(value) }}

          template( v-slot:item.createdAt="{ value }" ) {{ getIsoDate(value) }}

</template>

<script lang="ts">
/**
 * mediaLibrary
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce } from 'lodash';

/* Files */
import { IPagination } from '../interfaces/pagination';
import { IMedia } from '../../server/media/interfaces/media';

// eslint-disable-next-line import/no-extraneous-dependencies
const { humanReadableFileSize } = require('vuetify/es5/util/helpers');

@Component
export default class MediaLibrary extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  currentPage!: number;

  @Prop({
    type: Array,
    required: true,
  })
  currentSort!: string[];

  @Prop({
    type: Array,
    required: true,
  })
  currentSortDesc!: boolean[];

  @Prop({
    type: Number,
    required: true,
  })
  itemsPerPage!: number;

  @Prop({
    type: Array,
    default: () => [
      10,
      25,
      50,
      100,
      -1,
    ],
  })
  itemsPerPageOptions!: number[];

  @Prop({
    type: Object,
    required: true,
  })
  pagination!: Omit<IPagination<IMedia>, 'data'>;

  @Prop({
    type: String,
    required: true,
  })
  search!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  select!: boolean;

  /* This is the ones that are selected */
  @Prop({
    type: [
      Array,
      Number,
    ],
  })
  value!: (number | null | undefined) | number[];

  $refs!: {
    confirm: any;
  };

  error: string | null = null;

  file: File | null = null;

  loading: boolean = false;

  preview = {};

  selectFromValue = true;

  currentSelected: Pick<IMedia, 'id'>[] = [];

  selectDisabled: boolean = false;

  checkSelection() {
    this.selectFromValue = true;
  }

  get selected() : Pick<IMedia, 'id'>[] {
    if (this.selectFromValue) {
      const data: Pick<IMedia, 'id'>[] = [];

      if (this.isMultiple) {
        data.push(...(this.value as number[]).map((id) => ({
          id,
        })));
      } else if (this.value && this.value > 0) {
        data.push({
          id: this.value as number,
        });
      }

      Vue.set(this, 'selected', data);
      Vue.set(this, 'selectFromValue', false);
    }

    return this.currentSelected;
  }

  set selected(selected: Pick<IMedia, 'id'>[]) {
    Vue.set(this, 'currentSelected', selected);
  }

  get isMultiple() {
    return Array.isArray(this.value);
  }

  get headers() {
    return [
      'preview',
      'originalFileName',
      'mimeType',
      'size',
      'user',
      'createdAt',
    ].map((value) => ({
      value,
      text: this.$i18n.t(`media:TABLE.HEADERS.${value.toUpperCase()}`),
      align: 'center',
      sortable: value !== 'preview',
    }));
  }

  get mediaList() {
    return this.$store.getters['media/list'];
  }

  get rules() {
    return [
      (item: File) => !item || item.size < 2000000 || this.$i18n.t('media:FORM.ERROR.TOO_BIG', {
        maxSize: humanReadableFileSize(2000000, false),
      }),
    ];
  }

  async deleteFiles() {
    const ids = this.selected.map(({ id }) => id);

    this.$log.debug('File delete confirmation requested', {
      ids,
    });

    const confirm = await this.$refs.confirm.open({
      typeWord: true,
    });

    if (!confirm) {
      this.$log.debug('File delete cancelled');
      return;
    }

    await this.$store.dispatch('media/delete', ids);

    this.selected = [];

    await this.reloadCurrent();
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
    }, 500)();
  }

  // eslint-disable-next-line class-methods-use-this
  getHumanFileSize(bytes: number) : string {
    return humanReadableFileSize(bytes, false);
  }

  // eslint-disable-next-line class-methods-use-this
  getIsoDate(str: string) : string {
    const date = new Date(str);

    return date.toISOString();
  }

  async reloadCurrent() {
    const sortBy: any = this.currentSort;

    await this.reload({
      sortBy,
      search: this.search,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      sortDesc: this.currentSortDesc,
    });
  }

  async reload(opts: {
    page: number;
    itemsPerPage: number;
    sortBy: string[];
    sortDesc: boolean[];
    search?: string | null;
  }) {
    Vue.set(this, 'loading', true);
    Vue.set(this, 'error', null);

    const { page, itemsPerPage: limit } = opts;

    /* Only support single column sorting */
    const sort = opts.sortBy[0];
    const sortDir = opts.sortDesc[0] ? 'DESC' : 'ASC';

    try {
      await this.$store.dispatch('media/list', {
        page,
        limit,
        sort,
        sortDir,
        search: opts.search ?? this.search,
      });

      this.$emit('update:query', {
        ...this.$route.query,
        sort,
        sortDir,
        page: page.toString(),
        limit: limit.toString(),
      });
    } catch (err) {
      this.$log.warn('Failed to reload media', {
        err,
      });

      Vue.set(this, 'error', err.message);
    }

    Vue.set(this, 'loading', false);
  }

  selectFiles() {
    if (this.isMultiple) {
      this.$emit('input', this.selected.map(({ id }) => id));
    } else if (this.selected.length > 0) {
      this.$emit('input', this.selected[0].id);
    } else {
      this.$emit('input', null);
    }

    this.$emit('close');

    Vue.set(this, 'selectFromValue', true);
  }

  async updateSearch(search: string) {
    this.filterResults(search === null ? '' : search);

    this.$emit('update:search', search);
  }

  async upload() {
    this.error = null;

    if (!this.file) {
      return;
    }

    // @todo validate files

    const data = new FormData();

    data.append('file', this.file, this.file.name);

    try {
      await this.$store.dispatch('media/upload', data);

      this.$store.commit('app/addSystemMessage', 'media:RESPONSE.OK');

      this.file = null;

      await this.reloadCurrent();
    } catch (err) {
      this.error = err.message;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
  .hover-click {
    cursor: pointer;
  }
</style>

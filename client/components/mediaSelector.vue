<template lang="pug">
    v-container( fluid )
      v-row(
        justify="center"
        dense
      )
        v-col(
          v-for="(item, key) in imgList"
          :key="key"
          cols="12"
          sm="6"
          md="4"
        )
          v-card
            v-img(
              height="200"
              :src="`/api/media/${item}`"
            )
            v-card-actions
              v-spacer
              v-btn(
                @click="removeItem(item)"
                color="red"
                icon
              )
                v-icon mdi-close-circle

      v-row
        v-col( cols="12" )
          v-btn(
            color="primary"
            block
            large
            @click.stop="openDialog()"
          )
            v-icon( left ) mdi-folder-multiple-image
            | {{ $t('media:FORM.BUTTONS.SELECT') }}

          v-dialog.dialog(
            v-model="dialog"
            eager
            fullscreen
          )

            v-card
              v-toolbar( flat dark color="primary" )
                v-btn(
                  icon
                  dark
                  @click="dialog = false"
                )
                  v-icon mdi-close

              oa-media-library(
                ref="library"
                :value="value"
                @input="$emit('input', $event)"
                @close="dialog = false"
                select
                :current-page="currentPage"
                :current-sort="currentSort"
                :current-sort-desc="currentSortDesc"
                :items-per-page="itemsPerPage"
                :pagination="pagination"
                :search.sync="search"
              )

</template>

<script lang="ts">
/**
 * mediaSelector
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */

@Component
export default class MediaSelector extends Vue {
  @Prop({
    type: [
      Number,
      Array,
    ],
    default: null,
  })
  value!: (number | null) | number[];

  $refs!: {
    library: any,
  };

  dialog: boolean = false;

  currentPage = 1;

  currentSort = ['originalFileName'];

  currentSortDesc = ['ASC'];

  itemsPerPage = 25;

  search = '';

  get pagination() {
    return this.$store.getters['media/pagination'];
  }

  get multiple() : boolean {
    return Array.isArray(this.value);
  }

  get imgList() {
    if (Array.isArray(this.value)) {
      return this.value;
    }

    if (this.value === null) {
      return [];
    }

    return [this.value];
  }

  openDialog() {
    try {
      this.$refs.library.checkSelection();
    } catch (err) {
      this.$log.error('Unable to check media library selection', {
        err,
      });
    }

    Vue.set(this, 'dialog', true);
  }

  removeItem(id: number) {
    if (this.multiple) {
      /* Remove id from array */
      const newItem = (this.value as number[])
        .filter((item) => item !== id);

      this.$emit('input', newItem);
    } else {
      /* Set value to null */
      this.$emit('input', null);
    }
  }
}
</script>

<style lang="scss">
  .dialog {
    z-index: 9999; // Overlay the maps
  }
</style>

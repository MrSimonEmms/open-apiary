<template lang="pug">
  v-row
    v-col(
      cols="12"
    )
      v-row()
        v-col(
          v-for="(item, key) in apiaryList"
          :key="key"
          cols="12"
          :sm="adjustColumns(6)"
          :md="adjustColumns(4)"
          :lg="adjustColumns(3)"
        )
          v-card(
            :to="{ \
              name: 'apiary-id',\
              params: { \
                id: item.id, \
              }, \
            }"
          )
            v-img(
              height="200px"
              :src="getApiaryImg(item, key)"
            )

            v-card-title {{ item.name }}

            v-divider.mx-4

            v-card-actions
              v-list-item.grow

                v-row(
                  align="center"
                  justify="end"
                )
                  v-tooltip( top )
                    span {{ $t('apiary:LIST.CARD.ACTIONS.COUNT') }}
                    template( v-slot:activator="{ on }" )
                      v-icon(
                        v-on="on"
                        color="amber darken-3"
                      ) mdi-beehive-outline
                      span.subheading.mx-2 0

                  v-tooltip(
                    v-if="item.location"
                    top
                  )
                    span {{ $t('apiary:LIST.CARD.ACTIONS.LOCATION') }}
                    template( v-slot:activator="{ on }" )
                      v-btn(
                        v-on="on"
                        icon
                        @click.stop
                        :href="generateLocationUrl(item.location)"
                        target="_blank"
                      )
                        v-icon(
                          color="error"
                        ) mdi-map-marker

</template>

<script lang="ts">
/**
 * index
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IApiary, ILocation } from '../../../server/apiary/interfaces/apiary';

@Component({
  async fetch({ store }) {
    await store.dispatch('apiary/loadAll');
  },

  head() {
    return {
      title: this.$i18n.t('apiary:LIST.TITLE'),
    };
  },
})
export default class ApiaryPage extends Vue {
  get apiaryList() {
    return this.$store.getters['apiary/list'];
  }

  /**
   * Adjust Columns
   *
   * Adjust the columns so they always fill out the line
   * if fewer than one line's worth
   *
   * @param {number} columnWidth
   * @return {number}
   */
  adjustColumns(columnWidth: number) : number {
    const lessThan = 12 / columnWidth;
    const items = this.apiaryList.length;

    if (items < lessThan) {
      return 12 / items;
    }

    return columnWidth;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars,class-methods-use-this
  generateLocationUrl(location: ILocation) : string {
    // @todo generate location url
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  getApiaryImg(item: IApiary, key: number) : string {
    if (item.image) {
      // @todo - get from asset store
      return '';
    }

    /* Max number /static/img/apiaries */
    const maxNumber = 4;

    /* No image set - calculate it based upon position */
    const imgNumber = (key % maxNumber) + 1;

    return `/img/apiaries/00${imgNumber}.jpg`;
  }
}
</script>

<style lang="scss" scoped>

</style>

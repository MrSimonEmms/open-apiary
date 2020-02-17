<template lang="pug">
  oa-card-grid(
    v-model="apiaryList"
    no-adjust-cols
  )
    template( v-slot:root )
      oa-new-button(
        :to="{ name: 'apiary-create' }"
      )

    template( v-slot:no-data ) {{ $t('apiary:LIST.NO_ITEMS') }}
      .mt-5
        v-btn(
          color="primary"
          nuxt
          :to="{ name: 'apiary-create' }"
        ) {{ $t('apiary:BUTTONS.NEW') }}

    template( v-slot:activator="{ item, id }" )
      v-card(
        :to="{ \
          name: 'apiary-id',\
          params: { \
            id: item.id, \
          }, \
        }"
      )

        div(
          v-if="showMap[item.id]"
          @click.stop.prevent.self=""
        )
          oa-map-selector(
            height="200px"
            :value="[item.location.latitude, item.location.longitude]"
            zoom="15"
            :draggable="false"
            disable-geo-location
            hide-geo-location
          )
        v-img(
          v-else
          height="200px"
          :src="getApiaryImg(item, id)"
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
                  span.subheading.mx-2 {{ item.hives.length }}

              v-tooltip(
                v-if="item.location"
                top
              )
                span {{ $t('apiary:LIST.CARD.ACTIONS.LOCATION') }}
                template( v-slot:activator="{ on }" )
                  v-btn(
                    v-on="on"
                    icon
                    @click.stop.prevent="toggleShowMap(item)"
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
import { IApiary } from '../../../server/apiary/interfaces/apiary';

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    setPageTitle(): void;
  }
}

@Component({
  async fetch({ store }) {
    await store.dispatch('apiary/loadAll');
  },

  created() {
    this.setPageTitle();
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class ApiaryPage extends Vue {
  showMap: { [key: string]: boolean } = {};

  get apiaryList() {
    return this.$store.getters['apiary/list'];
  }

  toggleShowMap(item: any) : void {
    Vue.set(this.showMap, item.id, !this.showMap[item.id]);
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

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'apiary:LIST.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

<template lang="pug">
  oa-card-grid(
    v-model="hives"
  )
    template( v-slot:root )
      oa-confirm( ref="confirm" )
      oa-new-button(
        :buttons="speedDial"
        open-icon="mdi-settings"
      )

    template( v-slot:no-data ) {{ $t('apiary:HIVES.NO_ITEMS') }}
      .mt-5
        v-btn(
          color="primary"
          nuxt
          :to="{ name: 'apiary-id-create' }"
        ) {{ $t('apiary:BUTTONS.NEW_HIVE') }}

    template( v-slot:activator="{ item }" )
      v-card(
        v-bind="{ color: isInAlertState(item) ? 'red lighten-4' : null }"
        :to="{ \
          name: 'apiary-id-hive',\
          params: { \
            id: apiary.id, \
            hive: item.id \
          }, \
        }"
      )
        v-card-title \#{{ item.apiaryCount }}
          v-spacer
          v-icon(
            v-if="isInAlertState(item)"
            color="warning"
          ) mdi-alert

        v-list-item(
          v-for="(listItem, key) in hiveList(item)"
          :key="key"
          two-line
        )
          v-list-item-content
            v-list-item-title {{ $t(`apiary:HIVES.CARD.${listItem.title}`) }}
            v-list-item-subtitle {{ listItem.value }}
</template>

<script lang="ts">
/**
 * index
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IApiary, IHive } from '../../../../server/apiary/interfaces/apiary';
import { IButton } from '../../../interfaces/newButton';
import Barcode from '../../../lib/barcode';

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
export default class ApiaryIDIndexPage extends Vue {
  $refs!: {
    confirm: any;
  };

  dialog: boolean = false;

  get speedDial() : IButton[] {
    return [{
      color: 'primary',
      icon: 'mdi-qrcode',
      display: () => this.hives.length > 0,
      click: async (event) => {
        event.stopPropagation();

        const barcode = new Barcode(this.apiary, this.hives, this.$i18n);

        barcode.debug = process.env.DEBUG_BARCODE === 'true';

        await barcode.generatePDF();
      },
    }, {
      color: 'success',
      icon: 'mdi-plus',
      to: {
        name: 'apiary-id-create',
      },
    }, {
      color: 'warning',
      icon: 'mdi-settings',
      to: {
        name: 'apiary-id-edit',
      },
    }, {
      color: 'red',
      icon: 'mdi-delete',
      click: async (event) => {
        event.stopPropagation();

        await this.deleteApiary();
      },
    }];
  }

  get apiary() : IApiary {
    return this.$store.getters['apiary/active'];
  }

  get hives() : IHive[] {
    return this.apiary?.hives ?? [];
  }

  async deleteApiary() {
    this.$log.debug('Apiary delete confirmation requested');

    const confirm = await this.$refs.confirm.open({
      typeWord: true,
    });

    if (!confirm) {
      this.$log.debug('Apiary delete cancelled');
      return;
    }

    if (this.hives.length > 0) {
      this.$store.commit('app/addSystemMessage', 'apiary:ERROR:HIVES_PRESENT');

      this.$log.warn('Apiary has hive - cannot delete', {
        apiary: this.apiary,
      });
      return;
    }

    await this.$store.dispatch('apiary/delete', this.apiary.id);

    await this.$router.push({
      name: 'apiary',
    });
  }

  hiveList(hive: IHive) {
    const [lastInspection] = hive?.inspections;

    return [{
      title: 'LAST_INSPECTION_DATE',
      value: lastInspection?.date ? this.$options.filters!.datetime(lastInspection.date) : '-',
    }, {
      title: 'ESTABLISHED_DATE',
      value: this.$options.filters!.datetime(hive.establishedDate),
    }, {
      title: 'ID',
      value: hive.uuid,
    }];
  }

  // @todo calculate if hive should be in alert state, from customisable params
  // eslint-disable-next-line class-methods-use-this
  isInAlertState() {
    return false;
  }

  setPageTitle() {
    this.$store.commit('app/setPageTitle', 'apiary:HIVES.TITLE');
  }
}
</script>

<style lang="scss" scoped>

</style>

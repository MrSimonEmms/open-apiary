<template lang="pug">
  div
    oa-confirm( ref="confirm" )

    oa-new-button(
      :buttons="speedDial"
      open-icon="mdi-settings"
    )
</template>

<script lang="ts">
/**
 * index
 */

/* eslint-disable */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IApiary } from '../../../../server/apiary/interfaces/apiary';
import { IButton } from '../../../interfaces/newButton';

@Component
export default class ApiaryIDIndexPage extends Vue {
  $refs!: {
    confirm: any;
  };

  dialog: boolean = false;

  speedDial: IButton[] = [{
    color: 'success',
    icon: 'mdi-plus',
  }, {
    color: 'warning',
    icon: 'mdi-settings',
    to: {
      name: 'apiary-id-edit',
      params: {
        id: '1',
      },
    },
  }, {
    color: 'red',
    icon: 'mdi-delete',
    click: async (event) => {
      event.stopPropagation();

      await this.deleteApiary();
    },
  }];

  get apiary() : IApiary {
    return this.$store.getters['apiary/active'];
  }

  async deleteApiary() {
    this.$log.debug('Apiary delete confirmation requested');

    const confirm = await this.$refs.confirm.open();

    if (!confirm) {
      this.$log.debug('Apiary delete cancelled');
      return;
    }

    if (this.apiary.hives.length > 0) {
      this.$log.warn('Apiary has hive - cannot delete', {
        apiary: this.apiary,
      });
    }

    await this.$store.dispatch('apiary/delete', this.apiary.id);

    await this.$router.push({
      name: 'apiary',
    });
  }
}
</script>

<style lang="scss" scoped>

</style>

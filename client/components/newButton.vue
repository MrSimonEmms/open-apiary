<template lang="pug">
  fragment
    // Single button - links through to a page
    v-btn(
      v-if="to"
      fixed
      bottom
      right
      nuxt
      :to="to"
      fab
      dark
      color="red"
    )
      v-icon {{ openIcon }}

    // Speed dial - multiple buttons
    v-speed-dial(
      v-else-if="buttons && buttons.length > 0"
      v-model="opened"
      fixed
      bottom
      right
      direction="top"
    )
      template( v-slot:activator )
        v-btn(
          v-model="opened"
          fab
          dark
          color="red"
        )
          v-icon( v-if="opened" ) {{ closeIcon }}
          v-icon( v-else ) {{ openIcon }}
      v-btn(
        v-for="(item, key) in buttons"
        :key="key"
        fab
        dark
        small
        :color="item.color"
        nuxt
        :to="item.to"
      )
        v-icon {{ item.icon }}
</template>

<script lang="ts">
/**
 * newButton
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router'; // eslint-disable-line import/no-extraneous-dependencies

/* Files */
import { IButton } from '../interfaces/newButton';

@Component({})
export default class NewButton extends Vue {
  opened: boolean = false;

  @Prop({
    type: Array,
    default: () => [],
  })
  buttons!: IButton[];

  @Prop({
    type: String,
    default: 'mdi-plus',
  })
  openIcon!: string;

  @Prop({
    type: String,
    default: 'mdi-close',
  })
  closeIcon!: string;

  @Prop({
    type: Object,
  })
  readonly to?: RawLocation;
}
</script>

<style lang="scss" scoped>

</style>

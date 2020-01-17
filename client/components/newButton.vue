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
      :light="dark === false"
      :dark="dark !== false"
      :color="color"
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
          :light="dark === false"
          :dark="dark !== false"
          :color="color"
        )
          v-icon( v-if="opened" ) {{ closeIcon }}
          v-icon( v-else ) {{ openIcon }}
      v-btn(
        v-for="(item, key) in buttons"
        :key="key"
        fab
        :light="item.dark === false"
        :dark="item.dark !== false"
        small
        :color="item.color"
        nuxt
        :to="item.to"
        v-on="getEvents(item)"
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
  readonly buttons!: IButton[];

  @Prop({
    type: String,
    default: 'primary',
  })
  readonly color!: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  readonly dark!: boolean;

  @Prop({
    type: String,
    default: 'mdi-plus',
  })
  readonly openIcon!: string;

  @Prop({
    type: String,
    default: 'mdi-close',
  })
  readonly closeIcon!: string;

  @Prop({
    type: Object,
  })
  readonly to?: RawLocation;

  // eslint-disable-next-line class-methods-use-this
  getEvents(item: IButton) {
    const events : { [key:string]: any } = {};

    if (item.click) {
      events.click = (event: Event) => item.click!(event);
    }

    return events;
  }
}
</script>

<style lang="scss" scoped>

</style>

<template lang="pug">
  component(
    :is="tag"
    nav
    dense
  )
    template( v-for="(item, key) in value" )
      v-list-group(
        v-if="item.menu"
        :key="key"
        color="white"
      )
        template( v-slot:activator )
          oa-nav-list-item( :item="item" )

        v-tooltip(
          v-for="(subItem, subKey) in item.menu"
          :key="subKey"
          right
          :disabled="!displayTooltip"
        )
          span {{ $t(subItem.title) }}
          template( v-slot:activator="{ on }" )
            v-list-item(
              nuxt
              color="amber"
              :exact="subItem.exact !== false"
              v-on="getEventListeners(subItem, on)"
              v-bind="{ \
                href: subItem.href, \
                target: subItem.hrefTarget, \
                to: subItem.to, \
              }"
            )
              oa-nav-list-item( :item="subItem" )


      v-tooltip(
        v-else
        :key="key"
        right
        :disabled="!displayTooltip"
      )
        span {{ $t(item.title) }}
        template( v-slot:activator="{ on }" )
          v-list-item(
            nuxt
            color="amber"
            :exact="item.exact !== false"
            v-on="getEventListeners(item, on)"
            v-bind="{ \
              href: item.href, \
              target: item.hrefTarget, \
              to: item.to, \
            }"
          )
            oa-nav-list-item( v-on="on" :item="item" )
</template>

<script lang="ts">
/**
 * navList
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */
import { IMenuItem } from '../interfaces/navDrawer';

@Component
export default class NavList extends Vue {
  @Prop({
    type: Boolean,
    default: true,
  })
  readonly displayTooltip!: boolean;

  @Prop({
    type: String,
    default: 'v-list',
  })
  readonly tag!: string;

  @Prop({
    type: Array,
    required: true,
  })
  readonly value!: IMenuItem[];

  // eslint-disable-next-line class-methods-use-this
  getEventListeners(config: IMenuItem, on: { [key: string]: any } = {}) {
    const events : { [key: string]: any } = {
      ...on,
    };
    if (config.click) {
      events.click = () => config.click!();
    }

    return events;
  }
}
</script>

<style lang="scss" scoped>

</style>

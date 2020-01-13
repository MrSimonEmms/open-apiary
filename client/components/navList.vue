<template lang="pug">
  component(
    :is="tag"
    nav
  )
    template( v-for="(item, key) in value" )
      v-list-group(
        v-if="item.menu"
        :key="key"
        color="white"
      )
        template( v-slot:activator )
          oa-nav-list-item( :item="item" )

        v-list-item(
          v-for="(subItem, subKey) in item.menu"
          :key="subKey"
          nuxt
          color="amber"
          :exact="subItem.exact !== false"
          v-on="getEventListeners(subItem)"
          v-bind="{ \
            href: subItem.href, \
            target: subItem.hrefTarget, \
            to: subItem.to, \
          }"
        )
          oa-nav-list-item( :item="subItem" )

      v-list-item(
        v-else
        :key="key"
        nuxt
        color="amber"
        :exact="item.exact !== false"
        v-on="getEventListeners(item)"
        v-bind="{ \
          href: item.href, \
          target: item.hrefTarget, \
          to: item.to, \
        }"
      )
        oa-nav-list-item( :item="item" )
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
    type: String,
    default: 'v-list',
  })
  readonly tag!: String;

  @Prop({
    type: Array,
    required: true,
  })
  readonly value!: IMenuItem[];

  // eslint-disable-next-line class-methods-use-this
  getEventListeners(config: IMenuItem) {
    const events : { [key: string]: any } = {};
    if (config.click) {
      events.click = () => config.click!();
    }

    return events;
  }
}
</script>

<style lang="scss" scoped>

</style>

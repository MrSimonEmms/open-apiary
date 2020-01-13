<template lang="pug">
  fragment
    v-list-item-avatar(
      v-if="item.avatar"
      :color="item.avatar.color"
    )
      span(
        v-if="item.avatar.text"
        :class="item.avatar.textColor ? `${item.avatar.textColor}--text` : ''"
      ) {{ item.avatar.text }}

      v-img(
        v-if="item.avatar.img"
        :src="item.avatar.img"
        :alt="item.avatar.alt"
      )

    v-list-item-icon( v-if="item.icon" )
      v-icon {{ item.icon }}

    v-list-item-content( v-if="item.title" )
      v-list-item-title {{ $t(item.title) }}
</template>

<script lang="ts">
/**
 * navListItem
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */
import { IMenuItem } from '../interfaces/navDrawer';

@Component
export default class NavListItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  readonly item!: IMenuItem;
}
</script>

<style lang="scss" scoped>
  .full-width {
    width: 100%;
  }
</style>

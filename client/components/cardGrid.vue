<template lang="pug">
  v-row
    slot( name="root" )
    v-col(
      cols="12"
    )
      v-row()
        v-col.text-center(
          v-if="value.length === 0"
          cols="12"
        )
          slot( name="no-data" ) @todo no data

        v-col(
          v-else
          v-for="(item, key) in value"
          :key="key"
          cols="12"
          :sm="adjustColumns(6)"
          :md="adjustColumns(4)"
          :lg="adjustColumns(3)"
        )
          slot(
            name="activator"
            :item="item"
            :id="key"
           ) {{ item }}

</template>

<script lang="ts">
/**
 * cardGrid
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */

@Component
export default class CardGrid extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  noAdjustCols!: boolean;

  @Prop({
    type: Array,
    required: true,
  })
  value!: any[];

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
    if (this.noAdjustCols) {
      return columnWidth;
    }

    const lessThan = 12 / columnWidth;
    const items = this.value.length;

    if (items < lessThan) {
      return 12 / items;
    }

    return columnWidth;
  }
}
</script>

<style lang="scss" scoped>

</style>

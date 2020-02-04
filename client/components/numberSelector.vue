<template lang="pug">
  v-text-field.text-center(
    v-model="value"
    append-icon="mdi-plus-box"
    prepend-inner-icon="mdi-minus-box"
    readonly
    :label="$t(label)"
    :hint="$t(hint)"
    :persistent-hint="persistentHint"
    @click:prepend-inner="decrement(min)"
    @click:append="increment(max)"
  )
</template>

<script lang="ts">
/**
 * numberSelector
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';
import { get as lodashGet } from 'lodash';

/* Files */

@Component
export default class NumberSelector extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  value!: number;

  @Prop({
    type: String,
    default: '',
  })
  readonly hint!: string;

  @Prop({
    type: String,
    required: true,
  })
  readonly label!: string;

  @Prop({
    type: Number,
    default: undefined,
  })
  readonly min!: number | undefined;

  @Prop({
    type: Number,
    default: undefined,
  })
  readonly max!: number | undefined;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly persistentHint!: boolean;

  decrement(min?: number) {
    const value = lodashGet(this, 'value') || 0;

    if (min === undefined || value > min) {
      this.$emit('input', value - 1);
    }
  }

  increment(max?: number) {
    const value = lodashGet(this, 'value') || 0;

    if (max === undefined || value < max) {
      this.$emit('input', value + 1);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

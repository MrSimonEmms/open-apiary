<template lang="pug">
  div
    v-tabs()
      v-tab(
        @click="textPreview = false"
      ) {{ $t('apiary:INSPECTIONS.FORM.NOTES.WRITE') }}
      v-tab(
        @click="textPreview = true"
      ) {{ $t('apiary:INSPECTIONS.FORM.NOTES.PREVIEW') }}

    div(
      v-if="textPreview"
      v-dompurify-html="$options.filters.markdown(value)"
    )
    div( v-else )
      v-textarea(
        auto-grow
        :placeholder="$t(placeholder)"
        :label="$t(label)"
        :value="value"
        @input="$emit('input', $event)"
      )
      p(
        v-html="$t('apiary:INSPECTIONS.FORM.NOTES.MARKDOWN_ALLOWED', \
        { url: markdownHelp })"
      )
</template>

<script lang="ts">
/**
 * markdownEditor
 */

/* Node modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */

@Component
export default class MarkdownEditor extends Vue {
  textPreview: boolean = false;

  @Prop({
    type: String,
    default: '',
  })
  label!: string;

  @Prop({
    type: String,
    default: '',
  })
  placeholder!: string;

  @Prop({
    type: String,
    required: true,
  })
  value!: string;

  markdownHelp: string = 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet';
}
</script>

<style lang="scss" scoped>

</style>

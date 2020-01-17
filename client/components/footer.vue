<template lang="pug">
  v-footer.px-0(
    absolute
    color="grey lighten-5"
  )
    v-container( fluid )
      v-row.mb-5
        v-divider( no-gutters )
      v-row(
        no-gutters
      )

        .caption(
          cols="12"
          md="6"
        ) &copy; {{ year }}
          | &nbsp;
          a(
            href="https://simonemms.com"
            target="_blank"
          ) Simon Emms

        v-spacer

        v-tooltip(
          v-for="(item, key) in links"
          :key="key"
          top
        )
          span {{ $t(item.text) }}
          template( v-slot:activator="{ on }" )
            v-btn(
              v-on="on"
              :href="item.link"
              target="_blank"
              active-class="no-active"
              text
              x-small
            )
              v-icon( size="20px" ) {{ item.icon }}

        v-spacer
</template>

<script lang="ts">
/**
 * footer
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

interface ILink {
  icon: string;
  link: string;
  text: string;
}

@Component
export default class Footer extends Vue {
  links: ILink[] = [{
    icon: 'mdi-gitlab',
    link: 'https://gitlab.com/mrsimonemms/open-apiary',
    text: 'footer:SOURCE_CODE',
  }];

  year: number = new Date()
    .getUTCFullYear();
}
</script>

<style lang="scss" scoped>
  .v-btn--active.no-active:before {
    background: {
      color: transparent;
    }
  }
</style>

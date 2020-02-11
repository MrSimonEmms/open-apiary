<template lang="pug">
  oa-base-layout
    v-content
      v-container.bg-img.fill-height(
        fluid
        :style="`background-image: url(${backgroundImg})`"
      )
        v-row.ma-0(
          align="center"
          justify="center"
        )
          v-col(
            cols="12"
            sm="8"
            md="4"
            lg="4"
            xl="3"
          )
            v-card(
              outlined
              flat
            )
              nuxt
</template>

<script lang="ts">
/**
 * login
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

@Component({
  layout: 'blank',
})
export default class LoginLayout extends Vue {
  // eslint-disable-next-line class-methods-use-this
  get backgroundImg() {
    /* This must be set in the /client/static/img/login folder - must be in format xxx.jpg */
    const min = 1;
    const max = 5;

    const fileNumber = Math.floor(Math.random() * (max - min + 1) + min)
      .toString()
      .padStart(3, '0');

    return `/img/login/${fileNumber}.jpg`;
  }
}
</script>

<style lang="scss" scoped>
  .bg-img {
    background: {
      size: cover;
      position: center center;
    }
  }
</style>

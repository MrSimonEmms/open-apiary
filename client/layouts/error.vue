<template lang="pug">
  oa-base-layout
    v-content.bg-img
      v-container.fill-height.bg-gradient.white--text( fluid )
        v-row.ma-0( justify="center" )
          v-col.text-center(
            cols="12"
            sm="8"
            md="4"
            lg="4"
            xl="3"
          )
            h1.display-4.font-weight-bold {{ error.statusCode }}

            .display-2
              span( v-if="error.statusCode === 404" ) {{ $t('error:PAGE_NOT_FOUND') }}
              span( v-else ) {{ $t('error:GENERAL_ERROR') }}

            .mt-5( v-if="error.statusCode !== 404" )
              | {{ $t('error:MESSAGE', { msg: error.message }) }}

            v-btn.mt-5(
              color="black"
              dark
              large
              nuxt
              :to="{ name: 'index' }"
            ) {{ $t('error:RETURN_TO_HOMEPAGE') }}

            .mt-12( v-if="error.statusCode !== 404" )
              v-btn(
                :href="bugUrl"
                target="_blank"
                color="error"
                x-small
              ) {{ $t('nav:DRAWER.REPORT_ISSUE') }}
                v-icon(
                  right
                  dark
                ) mdi-bug
</template>

<script lang="ts">
/**
 * error
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';

/* Files */
import { IVueError } from '../interfaces/error';

export default Vue.extend({
  layout: 'blank',

  props: {
    error: {
      type: Object,
      default: null,
    } as Vue.PropOptions<IVueError>,
  },

  data() {
    return {
      bugUrl: process.env.PROJECT_BUGS,
    };
  },

  created() {
    Vue.$log.error('General Nuxt error', {
      statusCode: this.error.statusCode,
      path: this.error.path,
      err: this.error.message,
    });
  },
});
</script>

<style lang="scss" scoped>
  @import '~vuetify/src/styles/styles.sass';

  .bg-img {
    background: {
      image: url('/img/login/005.jpg');
      size: cover;
      position: center center;
    }

    .bg-gradient {
      $base-color: map-get($grey, 'darken-4');

      background: {
        image: linear-gradient(to top right, rgba($base-color, .75), rgba($base-color, .75));
      }
    }
  }
</style>

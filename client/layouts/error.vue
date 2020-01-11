<template lang="pug">
  oa-base-layout
    v-row( justify="center" )
      v-col( cols="12" )
        v-row( no-gutters justify="center" )
          v-col(
            cols="12"
            lg="10"
            xl="8"
          )
            v-row( no-gutters )
              v-col.pr-2(
                cols="12"
              )
                v-row.pb-2( no-gutters )
                  v-card(
                    width="100%"
                    flat
                  )
                    v-card-title.subtitle-1.red--text.font-weight-medium.text-uppercase
                      span( v-if="error.statusCode === 404") Page not found
                      span( v-else ) Error

                    v-card-text
                      NuxtLink( :to="{ name: 'index' }" ) Home page
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

  created() {
    Vue.$log.error('General Nuxt error', {
      err: this.error,
    });
  },
});
</script>

<style lang="scss" scoped>

</style>

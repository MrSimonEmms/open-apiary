<template lang="pug">
  div
    v-tabs(
      v-model="tab"
      fixed-tabs
      background-color="transparent"
    )
      v-tab(
        v-for="(item, key) in pages"
        :key="key"
      ) {{ $t(`settings:${item.name.toUpperCase()}_PAGE.TAB`) }}

    v-tabs-items( v-model="tab" )
      v-tab-item(
        v-for="(item, key) in pages"
        :key="key"
      )
        v-card.grey.lighten-5(
          flat
          tile
        )
          nuxt-child

</template>

<script lang="ts">
/**
 * settings
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */

/* Define the validator on the instance */
declare module 'vue/types/vue' {
  interface Vue {
    setPageTitle(): void;
  }
}

const pages = [{
  name: 'index',
}, {
  name: 'password',
}, {
  name: 'users',
}];

function getSettingsTab(name?: string) : number {
  if (name) {
    const routeName = name.match(/^settings-(.*)/);

    if (routeName) {
      const [, pageName] = routeName;

      return pages.findIndex((item) => item.name === pageName);
    }
  }

  /* Default */
  return 0;
}

@Component({
  middleware: [
    'isSetup',
    'isLoggedIn',
  ],

  created() {
    this.setPageTitle();
  },

  watch: {
    $route() {
      this.setPageTitle();
    },
  },
})
export default class SettingsPage extends Vue {
  get tab() {
    const { name } = this.$route;

    return getSettingsTab(name);
  }

  set tab(tab: number) {
    const page = pages[tab];

    if (!page) {
      return;
    }

    let name = 'settings';

    if (page.name !== 'index') {
      name += `-${page.name}`;
    }

    this.$router.push({
      name,
    });
  }

  pages = pages;

  setPageTitle() {
    const tab = getSettingsTab(this.$route.name);

    this.$store.commit('app/setPageTitle', `settings:${pages[tab].name.toUpperCase()}_PAGE.TITLE`);
  }
}
</script>

<style lang="scss" scoped>

</style>

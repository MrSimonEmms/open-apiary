<template lang="pug">
  v-navigation-drawer.elevation-4.amber.darken-3(
    app
    dark
    v-model="drawer"
    :mini-variant="isMini"
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
  )

    template( v-slot:img )
      v-img(
        height="100%"
        width="100%"
        src="/img/bees-in-entrance.jpg"
      )
        .fill-height.nav-drawer-gradient

    v-list
      v-tooltip(
        :disabled="!isMini"
        right
      )
        span {{ appName }}
        template( v-slot:activator="{ on }")
          v-list-item.app-title(
            v-on="on"
            nuxt
            :to="{ name: 'index' }"
          )
            v-list-item-avatar( tile )
              v-img(
                src="/img/icon.png"
              )
            v-list-item-content
              v-list-item-title.title {{ appName }}

    v-divider

    oa-nav-list(
      v-model="userMenu"
      :displayTooltip="isMini"
    )

    v-divider

    oa-nav-list(
      v-model="menu"
      :displayTooltip="isMini"
    )

    template( v-slot:append )
      oa-nav-list(
        v-model="footerMenu"
        :displayTooltip="isMini"
      )

</template>

<script lang="ts">
/**
 * navDrawer
 */

/* Node modules */
import { Vue, Component } from 'vue-property-decorator';

/* Files */
import { IMenuItem } from '../interfaces/navDrawer';

@Component
export default class NavDrawer extends Vue {
  menu: IMenuItem[] = [{
  //   to: {
  //     name: 'index',
  //   },
  //   icon: 'mdi-view-dashboard',
  //   title: 'nav:DRAWER.DASHBOARD',
  // }, {
    exact: false,
    to: {
      name: 'apiary',
    },
    icon: 'mdi-beehive-outline',
    title: 'nav:DRAWER.APIARIES',
  }, {
    to: {
      name: 'media',
    },
    icon: 'mdi-folder-multiple-image',
    title: 'nav:DRAWER.MEDIA',
  }, {
    to: {
      name: 'scanner',
    },
    icon: 'mdi-qrcode',
    title: 'nav:DRAWER.SCANNER',
  }];

  get appName(): string {
    return this.$store.getters['app/appName'];
  }

  get drawer() : boolean | null {
    return this.$store.getters['app/drawerDisplay'];
  }

  set drawer(state: boolean | null) {
    this.$store.commit('app/setDrawerDisplay', state);
  }

  get footerMenu() : IMenuItem[] {
    return [{
      icon: this.isMini ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left',
      title: 'nav:DRAWER.COLLAPSE',
      click: () => {
        this.isMini = !this.isMini;
      },
    }, {
      href: process.env.PROJECT_BUGS,
      hrefTarget: '_blank',
      icon: 'mdi-bug',
      title: 'nav:DRAWER.REPORT_ISSUE',
    }, {
      href: process.env.PROJECT_HOMEPAGE,
      hrefTarget: '_blank',
      icon: 'mdi-help-circle-outline',
      title: 'nav:DRAWER.HELP',
    }];
  }

  get isMini() : boolean {
    return this.$store.getters['app/isDrawerMini'];
  }

  set isMini(isMini: boolean) {
    this.$store.commit('app/setDrawerMini', isMini);
  }

  get userMenu() : IMenuItem[] {
    return [{
      avatar: {
        img: this.gravatar({
          size: 40,
        }),
      },
      title: this.user?.name,
      menu: [{
        icon: 'mdi-settings',
        title: 'nav:DRAWER.SETTINGS',
        to: {
          name: 'settings',
        },
      }, {
        icon: 'mdi-logout',
        title: 'nav:DRAWER.LOGOUT',
        to: {
          name: 'logout',
        },
      }],
    }];
  }

  get gravatar() {
    return this.$store.getters['user/gravatar'];
  }

  get user() {
    return this.$store.getters['user/user'];
  }
}
</script>

<style lang="scss" scoped>
  .app-title.v-list-item--link {
    &:before {
      background: {
        color: transparent;
      }
    }
  }
</style>

<style lang="scss" slot-scope="image">
  @import '~vuetify/src/styles/styles.sass';

  .nav-drawer-gradient {
    $base-color: map-get($grey, 'darken-4');

    background: {
      image: linear-gradient(to top right, rgba($base-color, .8), rgba($base-color, .8));
    }
  }
</style>

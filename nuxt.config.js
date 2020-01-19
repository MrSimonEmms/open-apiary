/**
 * nuxt.config
 */

/* Node modules */

/* Third-party modules */

/* Files */
const pkg = require('./package.json');

module.exports = {
  srcDir: './client/',
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate(title) {
      const name = 'Open Apiary';
      if (title) {
        return `${title} | ${name}`;
      }
      return name;
    },
    meta: [{
      charset: 'utf-8',
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    }, {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || '',
    }, {
      name: 'application-name',
      content: '&nbsp;',
    }, {
      name: 'msapplication-TileColor',
      content: '#FFFFFF',
    }, {
      name: 'msapplication-TileImage',
      content: '/img/favicon/mstile-144x144.png',
    }, {
      name: 'msapplication-square70x70logo',
      content: '/img/favicon/mstile-70x70.png',
    }, {
      name: 'msapplication-square150x150logo',
      content: '/img/favicon/mstile-150x150.png',
    }, {
      name: 'msapplication-wide310x150logo',
      content: '/img/favicon/mstile-310x150.png',
    }, {
      name: 'msapplication-square310x310logo',
      content: '/img/favicon/mstile-310x310.png',
    },
    ],
    link: [{
      rel: 'apple-touch-icon-precomposed',
      sizes: '57x57',
      href: '/img/favicon/apple-touch-icon-57x57.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '114x114',
      href: '/img/favicon/apple-touch-icon-114x114.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '72x72',
      href: '/img/favicon/apple-touch-icon-72x72.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '144x144',
      href: '/img/favicon/apple-touch-icon-144x144.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '60x60',
      href: '/img/favicon/apple-touch-icon-60x60.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '120x120',
      href: '/img/favicon/apple-touch-icon-120x120.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '76x76',
      href: '/img/favicon/apple-touch-icon-76x76.png',
    }, {
      rel: 'apple-touch-icon-precomposed',
      sizes: '152x152',
      href: '/img/favicon/apple-touch-icon-152x152.png',
    }, {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon/favicon-196x196.png',
      sizes: '196x196',
    }, {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon/favicon-96x96.png',
      sizes: '96x96',
    }, {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon/favicon-32x32.png',
      sizes: '32x32',
    }, {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon/favicon-16x16.png',
      sizes: '16x16',
    }, {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon/favicon-128.png',
      sizes: '128x128',
    }],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#ff8f00',
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    './plugins/components',
    './plugins/i18next',
    './plugins/logger',
    './plugins/vuelidate',
    './plugins/vuexPersistedState',
    './plugins/axios', // Put after the logger - log id added to outgoing
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  axios: {
    browserBaseURL: '/',
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: [
      '~/assets/variables.scss',
    ],
  },
  typescript: {
    typeCheck: {
      eslint: true,
    },
  },
  env: {
    BUILD_ID: process.env.BUILD_ID,
    VERSION: process.env.VERSION,
    PROJECT_HOMEPAGE: pkg.homepage,
    PROJECT_BUGS: pkg.bugs.url,
  },
};

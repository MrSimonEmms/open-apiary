/**
 * nuxt.config
 */

/* Node modules */

/* Third-party modules */

/* Files */

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
    }],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    }],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#ff8f00'
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
  },
};

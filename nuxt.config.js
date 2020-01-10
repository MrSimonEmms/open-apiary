/**
 * nuxt.config
 */

/* Node modules */

/* Third-party modules */

/* Files */

module.exports = {
  srcDir: './client/',
  server: {
    port: 8080
  },
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate(title) {
      const name = 'Open Apiary';
      if (title) {
        return `${name} | ${title}`;
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
    color: '#fff'
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
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
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
}

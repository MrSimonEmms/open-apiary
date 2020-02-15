/**
 * config
 */

/* Node modules */

/* Third-party modules */

/* Files */

module.exports = {
  title: 'Open Apiary',
  description: 'An application to enable beekeepers to keep track of their records and maintain healthy apiaries.',
  base: process.env.CONFIG_BASE,
  themeConfig: {
    nav: [{
      text: 'Guide',
      link: '/guide/',
    }, {
      text: 'Usage',
      link: '/usage/',
    }, {
      text: 'Contributing',
      link: '/contributing/',
    }, {
      text: 'Issues',
      link: 'https://gitlab.com/MrSimonEmms/open-apiary/issues',
    }, {
      text: 'Source Code',
      link: 'https://gitlab.com/mrsimonemms/open-apiary',
    }],
    sidebar: [{
      title: 'Guide',
      path: '/guide/',
      sidebarDepth: 2,
      children: [
        '/guide/',
        '/guide/getting-started',
        '/guide/setup',
        '/guide/deployment',
      ],
    }, {
      title: 'Usage',
      path: '/usage/',
      children: [],
    }, {
      title: 'Contributing',
      path: '/contributing/',
      children: [],
    }],
  }
};

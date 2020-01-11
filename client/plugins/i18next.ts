/**
 * i18next
 */

/* Node modules */

/* Third-party modules */
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import { Vue } from 'vue-property-decorator';
import { Plugin } from '@nuxt/types'; // eslint-disable-line import/no-unresolved

/* Files */

const langDetector = require('i18next-express-middleware/lib/languageLookups/header').default;
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
const resources = require('@alienfast/i18next-loader?basenameAsNamespace=true!../locales/index');

Vue.use(VueI18Next);

const fallbackLng = 'en';

if (!(fallbackLng in resources)) {
  /* Ensure we have the fallback language object */
  resources[fallbackLng] = {};
}

i18next
  .init({
    resources,
    fallbackLng,
    /* Fallback language is assumed to have all the namespaces */
    ns: Object.keys(resources[fallbackLng]),
  });

const i18n = new VueI18Next(i18next);

const i18NextPlugin : Plugin = async ({ app, req, res }) => {
  let lng;
  try {
    if (process.server) {
      /* Server language detector */
      [lng] = langDetector.lookup(req, res, {});
    } else {
      /* Browser language detector */
      lng = navigator.language;
    }
  } catch (err) {
    /* Failed to detect language */
    Vue.$log.debug('Failed to detect language', {
      err,
    });
  }

  /* Set the language */
  if (lng) {
    Vue.$log.debug('Changing language', {
      lng,
    });

    await i18next.changeLanguage(lng);
  }

  Vue.set(app, 'i18n', i18n);
};

export default i18NextPlugin;

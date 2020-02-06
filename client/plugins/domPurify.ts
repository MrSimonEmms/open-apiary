/**
 * domPurify
 */

/* Node modules */

/* Third-party modules */
import VueDOMPurifyHTML from 'vue-dompurify-html';
import { Vue } from 'vue-property-decorator';

/* Files */

Vue.use(VueDOMPurifyHTML, {
  default: {
    USE_PROFILES: {
      html: true,
      svg: true,
      mathMl: true,
    },
  },
  namedConfigurations: {
    strip: {
      USE_PROFILES: {
        html: false,
        svg: false,
        mathMl: false,
      },
    },
  },
});

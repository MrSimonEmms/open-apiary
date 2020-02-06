/**
 * filters
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';

/* Files */
import datetime from '../filters/datetime';
import marked from '../filters/markdown';

Vue.filter('datetime', datetime);
Vue.filter('markdown', marked);

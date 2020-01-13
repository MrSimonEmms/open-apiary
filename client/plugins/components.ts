/**
 * components
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';

/* Files */
import AppBar from '../components/appBar.vue';
import BaseLayout from '../components/baseLayout.vue';
import NavDrawer from '../components/navDrawer.vue';
import NavList from '../components/navList.vue';
import NavListItem from '../components/navListItem.vue';

const { Fragment } = require('vue-fragment');

Vue.component('Fragment', Fragment); // This should be used sparingly

Vue.component('oaAppBar', AppBar);
Vue.component('oaBaseLayout', BaseLayout);
Vue.component('oaNavDrawer', NavDrawer);
Vue.component('oaNavList', NavList);
Vue.component('oaNavListItem', NavListItem);

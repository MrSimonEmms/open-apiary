/**
 * components
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';

/* Files */
import ApiaryEditor from '../components/apiaryEditor.vue';
import AppBar from '../components/appBar.vue';
import BaseLayout from '../components/baseLayout.vue';
import Breadcrumbs from '../components/breadcrumbs.vue';
import CardGrid from '../components/cardGrid.vue';
import ChangePassword from '../components/changePassword.vue';
import Confirm from '../components/confirm.vue';
import Footer from '../components/footer.vue';
import HiveEditor from '../components/hiveEditor.vue';
import InspectionEditor from '../components/inspectionEditor.vue';
import MapSelector from '../components/mapSelector.vue';
import MarkdownEditor from '../components/markdownEditor.vue';
import MediaLibrary from '../components/mediaLibrary.vue';
import MediaSelector from '../components/mediaSelector.vue';
import NavDrawer from '../components/navDrawer.vue';
import NavList from '../components/navList.vue';
import NavListItem from '../components/navListItem.vue';
import NewButton from '../components/newButton.vue';
import NumberSelector from '../components/numberSelector.vue';

const { Fragment } = require('vue-fragment');

Vue.component('Fragment', Fragment); // This should be used sparingly

Vue.component('oaApiaryEditor', ApiaryEditor);
Vue.component('oaAppBar', AppBar);
Vue.component('oaBaseLayout', BaseLayout);
Vue.component('oaBreadcrumbs', Breadcrumbs);
Vue.component('oaCardGrid', CardGrid);
Vue.component('oaChangePassword', ChangePassword);
Vue.component('oaConfirm', Confirm);
Vue.component('oaFooter', Footer);
Vue.component('oaHiveEditor', HiveEditor);
Vue.component('oaInspectionEditor', InspectionEditor);
Vue.component('oaMapSelector', MapSelector);
Vue.component('oaMarkdownEditor', MarkdownEditor);
Vue.component('oaMediaLibrary', MediaLibrary);
Vue.component('oaMediaSelector', MediaSelector);
Vue.component('oaNavDrawer', NavDrawer);
Vue.component('oaNavList', NavList);
Vue.component('oaNavListItem', NavListItem);
Vue.component('oaNewButton', NewButton);
Vue.component('oaNumberSelector', NumberSelector);

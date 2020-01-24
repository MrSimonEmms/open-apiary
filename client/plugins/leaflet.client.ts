/**
 * leaflet.client
 */

/* Node modules */

/* Third-party modules */
import { Vue } from 'vue-property-decorator';
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
} from 'vue2-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Files */
const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

Vue.component('lMap', LMap);
Vue.component('lIcon', LIcon);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

// eslint-disable-next-line no-underscore-dangle
delete (<any> Icon).Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

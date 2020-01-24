import url from "url";
<template lang="pug">
  client-only
    l-map(
      :style="`height: ${height}; width: ${width};`"
      :zoom="zoomNumber"
      :center="center"
      @click="setPosition($event.latlng)"
      @update:zoom="zoomUpdate"
    )
      l-tile-layer( :url="url" )
      l-marker(
        :lat-lng="value"
        :draggable="draggable"
      )
        l-icon(:icon-anchor="[20,36]")
          v-icon( x-large color="red" ) mdi-map-marker
      v-btn.location-crosshairs.ma-2(
        v-if="geoLocationEnabled"
        fab
        dark
        small
        color="primary"
        @click.stop.prevent="getGeoPosition()"
      )
        v-icon(
          dark
        ) mdi-crosshairs-gps
</template>

<script lang="ts">
/**
 * mapSelector
 */

/* Node modules */

/* Third-party modules */
import { Vue, Component, Prop } from 'vue-property-decorator';

/* Files */

@Component
export default class MapSelector extends Vue {
  geoLocationEnabled: boolean = false;

  @Prop({
    type: [
      String,
    ],
    default: null,
  })
  bounds!: string | null;

  @Prop({
    type: Boolean,
    default: false,
  })
  disableGeoLocation!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  hideGeoLocation!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  draggable!: boolean;

  @Prop({
    type: String,
    default: '400px',
  })
  height!: string;

  @Prop({
    type: String,
    default: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
  })
  url!: string;

  @Prop({
    type: Array,
  })
  value!: [number, number];

  @Prop({
    type: String,
    default: '100%',
  })
  width!: string;

  @Prop({
    type: [
      String,
      Number,
    ],
    default: 8,
  })
  zoom!: number | string;

  get center() {
    return {
      lat: this.value[0],
      lng: this.value[1],
    };
  }

  get zoomNumber() {
    return Number(this.zoom);
  }

  mounted() {
    /* Not available for SSR */
    this.getGeoPosition(!this.disableGeoLocation);
  }

  getGeoPosition(updatePosition: boolean = true) {
    this.$log.debug('Checking for GeoLocation');

    try {
      if (!('geolocation' in navigator)) {
        this.$log.warn('GeoLocation not available');
        return;
      }
    } catch (err) {
      this.$log.warn('GeoLocation and navigator not available', {
        err,
      });
      return;
    }

    if (this.hideGeoLocation) {
      this.$log.debug('Hiding GeoLocation');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.geoLocationEnabled = true;

      this.$log.debug('GeoLocated position resolved', position);

      if (updatePosition) {
        this.setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }
    }, (err) => {
      this.$log.error('GeoLocation failed', {
        err,
      });
    });
  }

  setPosition(position: { lat: number, lng: number }) {
    this.$emit('input', [
      position.lat,
      position.lng,
    ]);
  }

  zoomUpdate(zoom: number) {
    this.$emit('update:zoom', zoom);
  }
}
</script>

<style lang="scss" scoped>
  .location-crosshairs {
    z-index: 9999;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

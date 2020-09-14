<template>
  <div>
    <div v-if="Rtwdocument.lat && Rtwdocument.long">
      <l-map :zoom="zoom" :center="center" v-bind:style="styleObject">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="markerUMM">
          <l-tooltip :options="{ permanent: true, interactive: true }">
            UMM
          </l-tooltip>
        </l-marker>
        <l-marker :lat-lng="markerPatient">
          <l-tooltip :options="{ permanent: true, interactive: true }">
            Patient
          </l-tooltip>
        </l-marker>
      </l-map>
    </div>
    <div v-else>
      <div v-if="typeof Rtwdocument.eta === 'string'">
        {{ Rtwdocument.eta }} - Komponente kann aktuell nicht geladen werden.
      </div>
      <div v-else>
        {{ stateMessage }}
      </div>
    </div>
  </div>
</template>

<script>
//Leaflet components
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
export default {
  data() {
    return {
      zoom: 15,
      center: L.latLng(this.Rtwdocument.lat, this.Rtwdocument.long),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markerUMM: L.latLng(49.492427, 8.487255),
      markerPatient: L.latLng(this.Rtwdocument.lat, this.Rtwdocument.long),
      stateMessage: "Karte wird geladen..."
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  props: {
    Rtwdocument: Object,
    selectedElements: Number
  },
  watch: {
    Rtwdocument: {
      handler() {
        this.adjustPosition(this.Rtwdocument.lat, this.Rtwdocument.long);
        if (typeof this.Rtwdocument.eta === "string") {
          this.stateMessage = this.Rtwdocument.eta;
        }
      },
      deep: true
    }
  },
  methods: {
    adjustPosition: function(lat, long) {
      this.markerPatient = L.latLng(lat, long);
      this.center = L.latLng(lat, long);
    }
  },
  computed: {
    styleObject: function() {
      if (this.selectedElements === 2) {
        return { height: "70vh", width: "62vw" };
      } else {
        return { height: "25vh", width: "62vw" };
      }
    }
  }
};
</script>

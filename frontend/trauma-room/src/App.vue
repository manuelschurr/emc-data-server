<template>
  <div id="app">
    <RtwSelection v-if="!rtwSelected" :selectRTW="selectRTW" />
    <div v-if="rtwSelected">
      <Header :changeRTW="changeRTW" />
      <PatientData />
      <div class="container-fluid" v-if="rtwSelected">
        <div class="row align-items-start">
          <div class="col-2"><LeftSidebar :arrivalTime="arrivalTime" /></div>
          <div class="col-8"><MainComponent :Rtwdocument="Rtwdocument" /></div>
          <div class="col-2"><RightSidebar /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/header.vue";
import PatientData from "./components/patientData.vue";
import RightSidebar from "./components/rightSidebar.vue";
import LeftSidebar from "./components/leftSidebar.vue";
import MainComponent from "./components/mainComponent.vue";
import RtwSelection from "./components/rtwSelection.vue";

export default {
  name: "App",
  data() {
    return {
      rtwSelected: false,
      Rtwdocument: {
        patientID: "123",
        identifier: "123",
        gnssPosition: {
          time: Date,
          long: 8.4660395,
          lat: 49.4874592
        }
      },
      arrivalTime: Number,
      test: Number
    };
  },
  components: {
    Header,
    PatientData,
    RightSidebar,
    LeftSidebar,
    MainComponent,
    RtwSelection
  },
  methods: {
    changeRTW: function() {
      this.rtwSelected = !this.rtwSelected;
    },
    selectRTW: function() {
      this.rtwSelected = !this.rtwSelected;
    },
    calculateRoute: function() {
      let request = new XMLHttpRequest();

      request.open(
        "POST",
        "https://api.openrouteservice.org/v2/matrix/driving-car"
      );

      request.setRequestHeader(
        "Accept",
        "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
      );
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader(
        "Authorization",
        "5b3ce3597851110001cf624801e9954029634268ad5336aa3eb55140" //API Key
      );
      let context = this;
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          context.arrivalTime = JSON.parse(
            request.responseText
          ).durations[0][1];
          console.log("Status:", request.status);
          console.log("Headers:", request.getAllResponseHeaders());
          console.log("Body:", request.responseText);
        }
      };
      let patientLoc = `[${this.Rtwdocument.gnssPosition.long},${this.Rtwdocument.gnssPosition.lat}]`;
      let ummLoc = `[8.487255, 49.492427]`;
      const body = `{"locations":[${patientLoc},${ummLoc}],"metrics":["duration"],"resolve_locations":"false","units":"m"}`;

      request.send(body);
    }
  },
  watch: {
    Rtwdocument: {
      handler() {
        this.calculateRoute();
      },
      deep: true
    }
  },
  mounted: function() {
    this.calculateRoute();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
</style>

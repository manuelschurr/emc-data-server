<template>
  <div id="app">
    <div class="d-flex justify-content-center" v-if="loading">
      <div
        class="spinner-border"
        style="position: fixed; top: 50%;"
        role="status"
      ></div>
      <div style="position: fixed; top: 55%;">
        Lade anfahrende Rettungswagen
      </div>
    </div>
    <div v-else>
      <RtwSelection
        v-if="!rtwSelected && !loading"
        :selectRTW="selectRTW"
        :activeAmbulances="activeAmbulances"
        :inactiveAmbulances="inactiveAmbulances"
        :Rtwdocument="Rtwdocument"
      />
      <div v-if="rtwSelected">
        <Header :changeRTW="changeRTW" />
        <PatientData :patientId="selectedRTW.patientId" />
        <div class="container-fluid" v-if="rtwSelected">
          <div class="row align-items-start">
            <div class="col-2">
              <LeftSidebar :arrivalTime="selectedRTW.eta" />
            </div>
            <div class="col-8">
              <MainComponent
                :Rtwdocument="Rtwdocument"
                :patientId="selectedRTW.patientId"
              />
            </div>
            <div class="col-2">
              <RightSidebar />
            </div>
          </div>
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
const axios = require("axios");

export default {
  name: "App",
  data() {
    return {
      rtwSelected: false,
      Rtwdocument: {
        long: null,
        lat: null,
        eta: null
      },
      activeAmbulances: [
        // {
        //   ambulanceId: 3,
        //   patientId: 1,
        //   identifier: "Malteser Hilfsdienst - Mockobjekt"
        // }
      ],
      inactiveAmbulances: [],
      loading: false,
      selectedRTW: Object,
      rtwLocations: [`[${8.487255}, ${49.492427}]`]
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
      this.selectedRTW = Object;
      //this.activeAmbulances = [];
      this.Rtwdocument.long = null;
      this.Rtwdocument.lat = null;
      this.Rtwdocument.eta = null;
      this.$forceUpdate();
    },
    selectRTW: function(rtw) {
      this.rtwSelected = !this.rtwSelected;
      this.selectedRTW = rtw;
      this.Rtwdocument.eta = rtw.eta;
      this.Rtwdocument.long = rtw.long;
      this.Rtwdocument.lat = rtw.lat;
    },
    getGnssdata: function() {
      let config = {
        method: "get",
        url:
          "https://134.155.48.211:3000/ambulance/findGnssByAmbulanceId/" +
          this.selectedRTW.ambulanceId
      };

      axios(config)
        .then(response => {
          this.rtwLocations.splice(
            1,
            1,
            `[${response.data.data.longitude}, ${response.data.data.latitude}]`
          );
          this.Rtwdocument.long = response.data.data.longitude;
          this.Rtwdocument.lat = response.data.data.latitude;
          this.computeETA();
        })
        .catch(error => {
          console.log(error);
        });
    },
    computeETA: function() {
      let request = new XMLHttpRequest();
      if (this.rtwLocations.length > 1) {
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
          "5b3ce3597851110001cf624808d1f959df534ac3adc0620256a68ec7" //API Key
        );
        let context = this;
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 200) {
              context.selectedRTW.eta = context.secToTime(
                JSON.parse(request.responseText).durations[1][0]
              );
              context.Rtwdocument.eta = context.selectedRTW.eta;
              context.$forceUpdate();
            } else {
              context.selectedRTW.eta = "Fehler bei Routen Schnittstelle";
              context.$forceUpdate();
            }
          }
        };
        const body = `{"locations": [${this.rtwLocations}]}`;
        request.send(body);
      }
    },
    secToTime: function(etaInSec) {
      if (!isNaN(etaInSec)) {
        const rtwTimeReductionFactor = 0.734;
        etaInSec = etaInSec * rtwTimeReductionFactor;
        var seconds = Math.floor(etaInSec % 60).toString();
        var minutes = Math.floor(etaInSec / 60).toString();
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        return minutes + " Minuten " + seconds + " Sekunden";
      }
    }
  },
  watch: {
    rtwSelected: {
      handler() {
        // Request GNSS Data from Server every 10 Seconds
        if (this.rtwSelected) {
          this.interval = setInterval(() => {
            this.getGnssdata();
          }, 10000);
        } else {
          clearInterval(this.interval);
        }
      }
    }
  },
  mounted: function() {
    // Consume REST-API
    let rtwAPI = "https://134.155.48.211:3000/ambulance/findAll";

    this.loading = true;
    axios
      .get(rtwAPI)
      .then(response => {
        for (var ambulance of response.data.data) {
          if (ambulance.patientId != 0) {
            this.activeAmbulances.push(ambulance);
          } else {
            this.inactiveAmbulances.push(ambulance);
          }
        }
        for (var r of this.activeAmbulances) {
          r.eta = 0;
        }
      })
      .catch(errors => {
        // react on errors.
        console.error("AXIOS ERROR: " + errors);
      })
      .finally(() => (this.loading = false));
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

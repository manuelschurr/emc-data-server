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
        :ambulances="rtwList"
      />
      <div v-if="rtwSelected">
        <Header :changeRTW="changeRTW" />
        <PatientData />
        <div class="container-fluid" v-if="rtwSelected">
          <div class="row align-items-start">
            <div class="col-2">
              <LeftSidebar :arrivalTime="selectedRTW.eta" />
            </div>
            <div class="col-8">
              <MainComponent :Rtwdocument="Rtwdocument" />
            </div>
            <div class="col-2"><RightSidebar /></div>
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
        patientID: "123",
        identifier: "123",
        gnssPosition: {
          time: Date,
          long: 8.4660395,
          lat: 49.4874592
        }
      },
      rtwList: [
        {
          patientID: "00",
          identifier: "UMM",
          gnssPosition: {
            time: Date,
            long: 8.487255,
            lat: 49.492427
          }
        },
        {
          patientID: "123",
          identifier: "DRK",
          gnssPosition: {
            time: Date,
            long: 8.4660395,
            lat: 49.4874592
          }
        },
        {
          patientID: "123",
          identifier: "ASB",
          gnssPosition: {
            time: Date,
            long: 8.7660395,
            lat: 49.4874592
          }
        }
      ],
      loading: false,
      selectedRTW: Object
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
    },
    selectRTW: function(rtw) {
      this.rtwSelected = !this.rtwSelected;
      this.selectedRTW = rtw; //TODO apply a watcher on selectedRTW; if selectedRTW != null, make get request every 5 seconds to get the current value of the selected RTW;
      //same logic for the get patient request
    }
  },
  /* watch: {
    rtwList: {
      handler() {
        this.computeAllETAs();
      },
      deep: true
    }
  }, */
  mounted: function() {
    // Consume REST-API
    let rtwAPI = "http://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findAll";

    this.loading = true;
    axios
      .get(rtwAPI)
      .then(response => (this.rtwList = response.data.data))
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

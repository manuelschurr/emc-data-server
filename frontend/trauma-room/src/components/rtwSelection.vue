<template>
  <div class="rtw_selection">
    <div>
      <h1>
        <img
          style="vertical-align: text-top;"
          alt="Universitätsklinikum Mannheim logo"
          src="../assets/umm_logo.png"
          height="50"
          width="150"
        />
        Universitätsklinikum Mannheim
      </h1>
      <ul v-if="ambulances.length">
        <div v-if="ambulancesWithETAs.length">
          <li
            v-for="ambulance in ambulancesWithETAs"
            v-bind:key="ambulance.identifier"
          >
            <div v-if="ambulance.patientId">
              <p>
                <button @click="selectRTW(ambulance)">
                  <img src="../assets/ambulance.png" width="100" />
                  <br />
                  <br />
                  RTW - {{ ambulance.identifier }}
                  <br />
                  ETA: {{ ambulance.eta }}
                  <br />
                  Informationen: {{ ambulance.miscellaneous }}
                  <br />
                  <ul>
                    <li
                      v-for="(value, name) in ambulance.abcde_schema"
                      v-bind:key="name"
                    >
                      <div class="text-center">
                        <button
                          v-if="value === false"
                          disabled
                          pill
                          class="rounded-circle notOkABCDE"
                        >
                          {{ name }}
                        </button>
                        <button
                          v-else-if="value === true"
                          disabled
                          pill
                          class="rounded-circle okABCDE"
                        >
                          {{ name }}
                        </button>
                      </div>
                    </li>
                  </ul>
                </button>
              </p>
            </div>
          </li>
        </div>
        <div v-else class="d-flex justify-content-center">
          <div
            class="spinner-border"
            style="position: fixed; top: 50%;"
            role="status"
          ></div>
          <div style="position: fixed; top: 55%;">{{ stateMessage }}</div>
        </div>
      </ul>
      <h3 v-else>... Aktuell fahren keine RTW's das UMM an ...</h3>
    </div>
  </div>
</template>

<script>
var axios = require("axios");

export default {
  name: "RtwSelection",
  props: {
    selectRTW: Function,
    ambulances: Array
  },
  data: () => ({
    arrivalTimes: [],
    ambulancesWithETAs: [],
    ambulancesWithNoETA: [],
    rtwLocations: [`[${8.487255}, ${49.492427}]`],
    stateMessage: "Berechne geschätzte Ankunftszeit"
  }),
  methods: {
    computeETA: function(currentRtw) {
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
              currentRtw.eta = context.secToTime(
                JSON.parse(request.responseText).durations[1][0]
              );
              // After computing the ETA, the patient miscellaneous informations (50 first characters of the miscellaneous)
              // and ABCDE Schema is fetched from the server.
              let config = {
                method: "get",
                url:
                  "https://134.155.48.211:3000/patient/findByAmbulanceId/" +
                  currentRtw.ambulanceId
              };
              var patientData = {};
              axios(config)
                .then(response => {
                  if (response.data.statusCode === "10000") {
                    patientData = {
                      patientId: response.data.data.patientId,
                      miscellaneous: response.data.data.miscellaneous.slice(
                        0,
                        50
                      ),
                      abcde_schema: {
                        A: response.data.data.AIsSelected,
                        B: response.data.data.BIsSelected,
                        C: response.data.data.CIsSelected,
                        D: response.data.data.DIsSelected,
                        E: response.data.data.EIsSelected
                      }
                    };
                  }
                })
                .catch(error => {
                  console.log("AXIOS PATIENT DATA ERROR: " + error);
                })
                .then(() => {
                  currentRtw.patientId = patientData.patientId;
                  currentRtw.miscellaneous = patientData.miscellaneous;
                  currentRtw.abcde_schema = patientData.abcde_schema;
                  context.ambulancesWithETAs.push(currentRtw);
                });
            } else {
              currentRtw.eta = "Fehler bei Routen Schnittstelle";
              context.ambulancesWithETAs.push(currentRtw);
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
    },
    getGnssData: function() {
      for (var rtw of this.ambulances) {
        if (rtw.ambulanceId) {
          let config = {
            method: "get",
            url:
              "https://134.155.48.211:3000/ambulance/findGnssByAmbulanceId/" +
              rtw.ambulanceId
          };

          axios(config)
            .then(response => {
              if (response.data.statusCode === "10000") {
                this.rtwLocations.splice(
                  1,
                  1,
                  `[${response.data.data.longitude}, ${response.data.data.latitude}]`
                );
                var currentRtw;
                for (var c of this.ambulances) {
                  if (response.data.data.ambulanceId === c.ambulanceId) {
                    currentRtw = c;
                  }
                }
                currentRtw.long = response.data.data.longitude;
                currentRtw.lat = response.data.data.latitude;
                this.computeETA(currentRtw);
              }
            })
            .catch(error => {
              var errorId = JSON.stringify(error.config.url.slice(-1));
              console.log(
                "Keine GNSS Daten verfügbar für AmbulanceID: " + errorId
              );
              this.stateMessage = JSON.stringify(error.message);

              //add I
              for (var ea of this.ambulances) {
                if (`"${ea.ambulanceId}"` === errorId) {
                  ea.eta = "Keine GNSS Daten verfügbar";
                  this.ambulancesWithETAs.push(ea);
                  this.$forceUpdate();
                }
              }
            });
        }
      }
    }
  },
  mounted: function() {
    this.getGnssData();
  }
};
</script>

<style scoped>
h1 {
  margin: 5px 0 40px;
}
h3 {
  margin: 100px 0 0;
}
ul {
  list-style-type: none;
  padding: 5px;
}
li {
  display: inline-block;
  margin: 5px 5px;
}
.okABCDE {
  background-color: green;
  color: white;
}
.notOkABCDE {
  background-color: red;
  color: white;
}
</style>

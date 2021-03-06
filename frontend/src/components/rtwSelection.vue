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
      <div v-if="openRouteError">
        <i class="fas fa-exclamation-triangle"></i>
        Der API-Token ist abgelaufen. Bitte updaten.
        <input size="60" v-model="apiKeyOpenRoute" />
        <button
          type="button"
          id="btn-api-key"
          class="btn btn-primary"
          v-on:click="updateApiKey"
          :disabled="apiButtonIsDisabled"
        >
          Update
        </button>
        <hr style="width: 100%; text-align: left; margin-left: 0;" />
      </div>
      <ul v-if="activeAmbulances.length">
        <div v-if="ambulancesWithETAs.length">
          <li
            v-for="ambulance in ambulancesWithETAs"
            v-bind:key="ambulance.identifier"
          >
            <div v-if="ambulance.patientId">
              <p>
                <button @click="selectRTW(ambulance)">
                  <img src="../assets/umm_team_logo.png" width="100" />
                  <br />
                  <br />
                  RTW - {{ ambulance.identifier }}
                  <br />
                  Geschätzte Ankunftszeit: {{ ambulance.eta }}
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
                        <button
                          v-else-if="value === null"
                          disabled
                          pill
                          class="rounded-circle nullABCDE"
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
    apiKeyOpenRoute: String
  },
  data: () => ({
    arrivalTimes: [],
    ambulancesWithETAs: [],
    ambulancesWithNoETA: [],
    rtwLocations: [`[${8.487255}, ${49.492427}]`],
    stateMessage: "Berechne geschätzte Ankunftszeit",
    openRouteError: false,
    apiButtonIsDisabled: true,
    token: "",
    activeAmbulances: [],
    inactiveAmbulances: [],
    timer: "",
  }),
  methods: {
    // Update the API Key for the OpenRouteService API. After a new Key is available, initiate the calculation of the ETA again.
    updateApiKey: function() {
      var context = this;
      var config = {
        method: "put",
        //TO CHANGE
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/apiKey/update/1",
        headers: { "x-access-token": this.token },
        data: {
          apiKeyId: 1,
          value: this.apiKeyOpenRoute
        }
      };

      axios(config)
        .then(function() {
          context.openRouteError = false;
          context.ambulancesWithETAs = [];
          context.getGnssData();
          context.$root.$emit("apiToken", context.apiKeyOpenRoute);
          context.$root.$emit("tokenStatus", context.openRouteError);
          context.$forceUpdate;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // Get the API Key for OpenRouteService that is stored in the DB.
    getApiKey: function() {
      var context = this;
      var config = {
        method: "get",
        //TO CHANGE
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/apiKey/findAll",
        headers: { "x-access-token": this.token }
      };

      axios(config)
        .then(function(response) {
          context.apiKeyOpenRoute = response.data.data[0].value;
          context.$root.$emit("apiToken", context.apiKeyOpenRoute);
          context.getGnssData();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // Compute the ETA for all active RTWs by using the OpenRouteService API
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
        request.setRequestHeader("Authorization", this.apiKeyOpenRoute);
        let context = this;
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 200) {
              currentRtw.eta = context.secToTime(
                JSON.parse(request.responseText).durations[1][0]
              );
              context.stateMessage = "ETA wurde berechnet";
              // After computing the ETA, the patient miscellaneous informations (50 first characters of the miscellaneous)
              // and ABCDE Schema is fetched from the server.
              let config = {
                method: "get",
                url:
                  "https://wifo1-29.bwl.uni-mannheim.de:3000/patient/findByAmbulanceId/" +
                  currentRtw.ambulanceId,
                headers: { "x-access-token": context.token }
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
                  var contains = false;
                  currentRtw.patientId = patientData.patientId;
                  currentRtw.miscellaneous = patientData.miscellaneous;
                  currentRtw.abcde_schema = patientData.abcde_schema;
                  for (var a of context.ambulancesWithETAs) {
                    if (currentRtw._id === a._id) {
                      contains = true;
                    }
                  }
                  if (!contains) {
                    context.ambulancesWithETAs.push(currentRtw);
                  }
                });
            } else {
              //Handle errors that occur by using the OpenRouteService API
              var contains = false;
              currentRtw.eta = "Fehler bei Routen Schnittstelle";
              context.stateMessage = "Fehler bei Routen Schnittstelle";
              for (var a of context.ambulancesWithETAs) {
                if (currentRtw._id === a._id) {
                  contains = true;
                }
              }
              if (!contains) {
                context.ambulancesWithETAs.push(currentRtw);
              }
              //Activate the error flag to trigger the input field for a new API key as a invalid API key is most of the time the source of errors for this request.
              context.openRouteError = true;
              context.$root.$emit("tokenStatus", context.openRouteError);
            }
          }
        };
        const body = `{"locations": [${this.rtwLocations}]}`;
        request.send(body);
      }
    },
    // Formats the time in seconds to minutes : seconds
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
    // Requests all RTWs from the REST-API
    retrieveRTWs() {
      var config = {
        method: "get",
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findAll",
        headers: { "x-access-token": this.token }
      };
      axios(config)
        .then(response => {
          // Sort the RTWs
          for (var ambulance of response.data.data) {
            if (ambulance.patientId != 0) {
              this.activeAmbulances.push(ambulance);
            } else {
              this.inactiveAmbulances.push(ambulance);
            }
          }
          // for (var r of this.activeAmbulances) {
          //   r.eta = 0;
          // }
          this.getGnssData();
        })
        .catch(errors => {
          // react on errors.
          console.error("AXIOS ERROR: " + errors);
        })
        .finally(() => (this.loading = false));
    },
    // Retrieve the GNSS Data for each active RTW
    getGnssData() {
      for (var rtw of this.activeAmbulances) {
        if (rtw.ambulanceId && rtw.patientId != 0) {
          let config = {
            method: "get",
            url:
              "https://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findGnssByAmbulanceId/" +
              rtw.ambulanceId,
            headers: { "x-access-token": this.token }
          };

          axios(config)
            .then(response => {
              if (response.data.statusCode === "10000") {
                // Create the GNSS format that is required by the OpenRouteService API to calcualte ETAs. This calculates ETA for the RTW to the UMM
                this.rtwLocations.splice(
                  1,
                  1,
                  `[${response.data.data.longitude}, ${response.data.data.latitude}]`
                );
                var currentRtw;
                for (var c of this.activeAmbulances) {
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
              for (var ea of this.activeAmbulances) {
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
    // Retrieve a valid token for the REST-API
    var context = this;
    var axios = require("axios");
    var data = {
      username: "root",
      password: "root"
    };

    var config = {
      method: "post",
      url: "https://wifo1-29.bwl.uni-mannheim.de:3000/user/login",
      headers: {},
      data: data
    };

    axios(config)
      .then(function(response) {
        context.token = response.data.data.token;
        //after the token is available in this component, call remaining routes.
        context.retrieveRTWs();
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  // 10 second timer which checks if new ambulances drive to the hospital.
  created() {
    this.timer = setInterval(this.retrieveRTWs, 10000);
  },
  // When the PulseOxy component is deactivated, the refreshing timer is stopped.
  beforeDestroy() {
      clearInterval(this.timer);
  },
  deactivated() {
      clearInterval(this.timer);
  },
  watch: {
    apiKeyOpenRoute: {
      // Enables the button for the update of the OpenRouteService API-Key if the correct number of characters is given.
      handler() {
        if (this.apiKeyOpenRoute.length === 56) {
          this.apiButtonIsDisabled = false;
        } else {
          this.apiButtonIsDisabled = true;
        }
      }
    }
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
.nullABCDE {
  background-color: #6c757d;
  color: white;
}
</style>

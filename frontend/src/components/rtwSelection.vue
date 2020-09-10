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
    inactiveAmbulances: []
  }),
  methods: {
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
              context.openRouteError = true;
              context.$root.$emit("tokenStatus", context.openRouteError);
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
    retrieveRTWs() {
      var config = {
        method: "get",
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findAll",
        headers: { "x-access-token": this.token }
      };
      axios(config)
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
          this.getGnssData();
        })
        .catch(errors => {
          // react on errors.
          console.error("AXIOS ERROR: " + errors);
        })
        .finally(() => (this.loading = false));
    },
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
        context.retrieveRTWs();
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  watch: {
    apiKeyOpenRoute: {
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
</style>

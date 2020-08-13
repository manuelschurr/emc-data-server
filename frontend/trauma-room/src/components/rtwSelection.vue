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
            <p>
              <button @click="selectRTW(ambulance)">
                <img src="../assets/ambulance.png" width="100" />
                <br />
                <br />
                RTW - {{ ambulance.identifier }}
                <br />
                ETA: {{ ambulance.eta }}
                <br />
                Diagnose: {{ ambulance.diagnosis }}
                <br />
                <ul>
                  <li
                    v-for="(value, name) in ambulance.abcde_schema"
                    v-bind:key="name"
                  >
                    <div class="text-center">
                      <button
                        v-if="value === true"
                        disabled
                        pill
                        class="rounded-circle notOkABCDE"
                      >
                        {{ name }}
                      </button>
                      <button
                        v-else-if="value === false"
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
          </li>
        </div>
        <div v-else class="d-flex justify-content-center">
          <div
            class="spinner-border"
            style="position: fixed; top: 50%;"
            role="status"
          ></div>
          <div style="position: fixed; top: 55%;">
            {{ stateMessage }}
          </div>
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
          "5b3ce3597851110001cf62486cd746dbfa404187b5fee363289e8fed" //API Key
        );
        let context = this;
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 200) {
              currentRtw.eta = context.secToTime(
                JSON.parse(request.responseText).durations[1][0]
              );
              context.ambulancesWithETAs.push(currentRtw);
            } else {
              context.ambulancesWithETAs = context.ambulances;
            }
          }
        };
        const body = `{"locations": [${this.rtwLocations}]}`;
        request.send(body);
      } else {
        this.ambulancesWithETAs = this.ambulances;
        for (var amb of this.ambulancesWithETAs) {
          amb.eta = "Nicht berechenbar aufgrund fehlender GNSS Daten";
        }
      }
    },
    secToTime: function(etaInSec) {
      if (!isNaN(etaInSec)) {
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
              "http://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findGnssByAmbulanceId/" +
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
                this.computeETA(currentRtw);
              }
            })
            .catch(error => {
              console.log("errrorrr: " + JSON.stringify(error));
              this.stateMessage = JSON.stringify(error.message);
              this.ambulancesWithETAs = this.ambulances;
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
  background-color: lightgreen;
}
.notOkABCDE {
  background-color: lightcoral;
}
</style>

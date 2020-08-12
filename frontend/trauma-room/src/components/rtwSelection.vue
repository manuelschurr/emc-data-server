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
            Berechne geschätzte Ankunftszeit
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
    ambulancesWithNoETA: []
    //rtwLocations: []
  }),
  methods: {
    computeAllETAs: function() {
      let request = new XMLHttpRequest();
      //Initialise rtwLocations with UMM's position as first element
      var rtwLocations = [`[${8.487255}, ${49.492427}]`];
      var index = 0;
      //Prototyping; change rtwList to the reponse object; first item in this list has to be the UMM address
      //Exception Handling: If no GNSS data is obtained, display rtw list without ETA
      for (var rtw of this.ambulances) {
        //For each RTW make a get request to obtian GNSS data and add to the rtwLocations []
        var ambulanceId = rtw.ambulanceId;
        var gnssPosition = this.getGnssData(ambulanceId);
        if (
          gnssPosition &&
          !isNaN(gnssPosition.longitude) &&
          !isNaN(gnssPosition.latitude)
        ) {
          rtwLocations.push(
            `[${gnssPosition.longitude}, ${gnssPosition.latitude}]`
          );
        } else {
          this.ambulancesWithNoETA.push(index);
        }
        index++;
      }
      console.log("rtwlocations: " + rtwLocations);
      if (rtwLocations.length > 1) {
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
            context.arrivalTimes = JSON.parse(
              request.responseText
            ).durations[0];
            context.mapETAs();
            console.log("Status:", request.status);
            console.log("Headers:", request.getAllResponseHeaders());
            console.log("Body:", request.responseText);
          }
        };
        const body = `{"locations": [${rtwLocations}]}`;
        request.send(body);
      } else {
        this.ambulancesWithETAs = this.ambulances;
        for (var amb of this.ambulancesWithETAs) {
          amb.eta = "Nicht berechenbar aufgrund fehlender GNSS Daten";
        }
      }
    },
    mapETAs: function() {
      for (var aIndex of this.ambulancesWithNoETA) {
        this.arrivalTimes.splice(aIndex, 0, "No GNSS available");
      }

      for (var i = 0; i < this.ambulances.length; i++) {
        if (!this.ambulancesWithNoETA.includes(i)) {
          this.ambulancesWithETAs[i].eta = this.secToTime(this.arrivalTimes[i]);
        } else {
          this.ambulancesWithETAs[i].eta =
            "Nicht berechenbar aufgrund fehlender GNSS Daten";
        }
      }

      this.ambulancesWithETAs = this.ambulances;
    },
    secToTime: function(etaInSec) {
      console.log("sectoTime: " + etaInSec);
      if (!isNaN(etaInSec)) {
        var seconds = Math.floor(etaInSec % 60).toString();
        var minutes = Math.floor(etaInSec / 60).toString();
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        return minutes + " Minuten " + seconds + " Sekunden";
      }
    },
    getGnssData(ambulanceId) {
      var data = JSON.stringify({ ambulanceId: 1 });
      console.log("gnss bodyy:_ " + ambulanceId);

      var config = {
        method: "get",
        url:
          "http://wifo1-29.bwl.uni-mannheim.de:3000/ambulance/findGnssByAmbulanceId",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      };
      console.log(config);

      axios(config)
        .then(function(response) {
          console.log("GNSS response: " + JSON.stringify(response.data));
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  mounted: function() {
    this.computeAllETAs();
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

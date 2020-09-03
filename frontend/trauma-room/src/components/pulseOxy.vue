<template>
  <div>
    <div class="row align-items-start" v-if="selectedElements < 2">
      <div class="col-12">
        <form class="form-inline" style="align-items: center;">
          <div class="col-9">
            <puls-oxy-line class="small" v-if="loaded" :chart-data="pulseChartData" />
          </div>
          <div v-if="lastPulse > 130 || lastPulse < 50" class="col-3 notOkPulseOxyColor">
            <br />
            <b>Pulse</b>
            <br />
            <div v-if="loaded">
              <div v-show="false" v-if="!pulseSoundPlayed">{{ this.playSound()}} {{ this.pulseSoundPlayed = true }}</div>
              <span class="bigFont">{{ lastPulse }}</span>
            </div>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-heart"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
              />
            </svg>
            <br />PR/min
          </div>
          <div v-else class="col-3 pulseColor">
            <br />
            <b>Pulse</b>
            <br />
            <div v-if="loaded">
              {{ this.pulseSoundPlayed = false }}
              <span class="bigFont">{{ lastPulse }}</span>
            </div>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-heart"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
              />
            </svg>
            <br />PR/min
          </div>
        </form>
      </div>
      <div class="col-12">
        <form class="form-inline" style="align-items: center;">
          <div class="col-9">
            <puls-oxy-line class="small" v-if="loaded" :chart-data="spo2ChartData" />
          </div>
          <div v-if="lastSpo2 < 90" class="col-3 notOkPulseOxyColor">
            <br />
            <b>
              SpO<sub>2</sub>
            </b>
            <br />
            <div v-if="loaded">
              <div v-show="false" v-if="!spo2SoundPlayed">{{ this.playSound()}} {{ this.spo2SoundPlayed = true }}</div>
              <span class="bigFont">{{ lastSpo2 }}</span>
            </div>O<sub>2</sub>
            <br />SpO<sub>2</sub>%
          </div>
          <div v-else class="col-3 spo2Color">
            <br />
            <b>
              SpO<sub>2</sub>
            </b>
            <br />
            <div v-if="loaded">
              {{ this.spo2SoundPlayed = false }}
              <span class="bigFont">{{ lastSpo2 }}</span>
            </div>O<sub>2</sub>
            <br />SpO<sub>2</sub>%
          </div>
        </form>
      </div>
    </div>
    <div class="row" v-else>
      <div v-if="lastPulse > 130 || lastPulse < 50" class="col notOkPulseOxyColor">
        <br />
        <b>Pulse</b>
        <br />
        <div v-if="loaded">
          <div v-show="false" v-if="!pulseSoundPlayed">{{ this.playSound()}} {{ this.pulseSoundPlayed = true }}</div>
          <span class="bigFont">{{ lastPulse }}</span>
        </div>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-heart"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
          />
        </svg>
        <br />PR/min
      </div>
      <div v-else class="col pulseColor">
        <br />
        <b>Pulse</b>
        <br />
        <div v-if="loaded">
          {{ this.pulseSoundPlayed = false }}
          <span class="bigFont">{{ lastPulse }}</span>
        </div>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-heart"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
          />
        </svg>
        <br />PR/min
      </div>
      <div v-if="lastSpo2 < 90" class="col notOkPulseOxyColor">
        <br />
        <b>
          SpO<sub>2</sub>
        </b>
        <br />
        <div v-if="loaded">
          <div v-show="false" v-if="!spo2SoundPlayed">{{ this.playSound()}} {{ this.spo2SoundPlayed = true }}</div>
          <span class="bigFont">{{ lastSpo2 }}</span>
        </div>O<sub>2</sub>
        <br />SpO<sub>2</sub>%
      </div>
      <div v-else class="col spo2Color">
        <br />
        <b>
          SpO<sub>2</sub>
        </b>
        <br />
        <div v-if="loaded">
          {{ this.spo2SoundPlayed = false }}
          <span class="bigFont">{{ lastSpo2 }}</span>
        </div>O<sub>2</sub>
        <br />SpO<sub>2</sub>%
      </div>
    </div>
  </div>
</template>

<script>
import PulsOxyLine from "./pulseOxyLine.vue";
const axios = require("axios");

export default {
  name: "LineChartContainer",
  components: { PulsOxyLine },
  data() {
    return {
      loaded: false,
      pulseSoundPlayed: false,
      spo2SoundPlayed: false,
      timer: "",
      pulseChartData: null,
      spo2ChartData: null,
      pulseData: [],
      lastPulse: "",
      pulseLabels: [],
      spo2Data: [],
      lastSpo2: "",
      spo2Labels: [],
    };
  },
  props: {
    patientId: Number,
    selectedElements: Number,
  },
  // Fill the chart with data and display it
  mounted() {
    this.fillData();
  },
  // Refreshes the PulseOxy chart every second with the data from the server.
  created() {
    this.timer = setInterval(this.fillData, 1000);
  },
  // Compute the last number of the pulse and the Spo2 rate by getting the last element of the data arrays.
  computed: {
    lastPulseCompute() {
      var lastPulseData = this.pulseData[this.pulseData.length - 1];
      this.$root.$emit("lastPulseData", lastPulseData);
      return lastPulseData;
    },
    lastSpo2Compute() {
      var lastSpo2Data = this.spo2Data[this.spo2Data.length - 1];
      this.$root.$emit("lastSpo2Data", lastSpo2Data);
      return lastSpo2Data;
    },
  },
  methods: {
    // Play a warning sound when the pulse or the Spo2 rate is critical.
    playSound() {
      var sound = new Audio(require("../assets/warning_sound.mp3"));
      return sound.play();
    },
    // Request the PulseOxy data from the server and depending on whether the
    // pulseOxy data array of the chart already has 20 entries or not,
    // gets the last 20 entries or only gets the newest entry.
    async fillData() {
      var vm = this;
      this.loading = true;

      if (vm.pulseData.length < 20) {
        // The first server request is to find the patient by the given patient ID
        var body = "";
        var config = {
          method: "get",
          url:
            "https://134.155.48.211:3000/patient/findByPatientId/" +
            vm.patientId,
          headers: {},
          data: body,
        };

        axios(config)
          .then(function (responsePatient) {
            if (responsePatient.data.statusCode === "10000") {
              // When the request is successful, the new request gets all the stored data of the patient.
              var bodySecond = "";
              var configSecond = {
                method: "get",
                url:
                  "https://134.155.48.211:3000/patient/findPulsoxyByPatientIdAndTimestamp?patientId=" +
                  vm.patientId +
                  "&timestamp=" +
                  responsePatient.data.data.createdAt,
                headers: {},
                data: bodySecond,
              };

              axios(configSecond).then(function (responsePulseOxy) {
                if (responsePulseOxy.data.statusCode === "10000") {
                  // When the request is successful, the pulseOxy data for the two charts is filled
                  // depending on whether there are already 20 entries in the server database or not.
                  var i;
                  if (responsePulseOxy.data.data.length < 20) {
                    for (i = 0; i < responsePulseOxy.data.data.length; i++) {
                      vm.pulseData.push(
                        responsePulseOxy.data.data[i].pulsrate.toString()
                      );
                      vm.pulseLabels.push(
                        responsePulseOxy.data.data[i].timestamp.slice(11, 19)
                      );
                      vm.spo2Data.push(
                        responsePulseOxy.data.data[i].spo2.toString()
                      );
                      vm.spo2Labels.push(
                        responsePulseOxy.data.data[i].timestamp.slice(11, 19)
                      );
                    }
                  } else {
                    for (
                      i = responsePulseOxy.data.data.length - 21;
                      i < responsePulseOxy.data.data.length;
                      i++
                    ) {
                      vm.pulseData.push(
                        responsePulseOxy.data.data[i].pulsrate.toString()
                      );
                      vm.pulseLabels.push(
                        responsePulseOxy.data.data[i].timestamp.slice(11, 19)
                      );
                      vm.spo2Data.push(
                        responsePulseOxy.data.data[i].spo2.toString()
                      );
                      vm.spo2Labels.push(
                        responsePulseOxy.data.data[i].timestamp.slice(11, 19)
                      );
                    }
                  }
                  // Settings of the two charts with their respective data gathered before.
                  vm.pulseChartData = {
                    labels: vm.pulseLabels,
                    datasets: [
                      {
                        label: "Pulse",
                        borderColor: "#36d7e7",
                        pointBackgroundColor: "white",
                        borderWidth: 2,
                        pointBorderColor: "#36d7e7",
                        backgroundColor: "transparent",
                        pointRadius: 0,
                        data: vm.pulseData,
                      },
                    ],
                  };
                  vm.spo2ChartData = {
                    labels: vm.pulseLabels,
                    datasets: [
                      {
                        label: "Spo2",
                        borderColor: "#36c1e7",
                        pointBackgroundColor: "white",
                        borderWidth: 2,
                        pointBorderColor: "#36c1e7",
                        backgroundColor: "transparent",
                        pointRadius: 0,
                        data: vm.spo2Data,
                      },
                    ],
                  };
                  vm.lastPulse = vm.lastPulseCompute;
                  vm.lastSpo2 = vm.lastSpo2Compute;
                  vm.loaded = true;
                }
              });
            }
          })
          .catch(function (error) {
            console.log("AXIOS ERROR: " + error);
          })
          .finally(() => (this.loading = false));
        await this.$nextTick();
      } else {
        // This server request is to find the patient by the given
        // patient ID with only the latest pulse and Spo2 date.
        var bodyPulseoxy = "";
        var configPulseoxy = {
          method: "get",
          url:
            "https://134.155.48.211:3000/patient/findPulsoxyByPatientId/" +
            vm.patientId,
          headers: {},
          data: bodyPulseoxy,
        };

        axios(configPulseoxy)
          .then(function (responsePulseOxy) {
            if (responsePulseOxy.data.statusCode === "10000") {
              // When the request is successful, the pulseOxy chart arrays are updated
              // with the latest data and if the array contains more than 20 entries,
              // the oldest entry is removed to ensure displaying the most relevant data.

              if (
                responsePulseOxy.data.data.timestamp.slice(11, 19) !=
                vm.pulseLabels[vm.pulseLabels.length - 1]
              ) {
                vm.pulseData.push(
                  responsePulseOxy.data.data.pulsrate.toString()
                );
                vm.pulseLabels.push(
                  responsePulseOxy.data.data.timestamp.slice(11, 19)
                );
                vm.spo2Data.push(responsePulseOxy.data.data.spo2.toString());
                vm.spo2Labels.push(
                  responsePulseOxy.data.data.timestamp.slice(11, 19)
                );
              }

              if (
                vm.pulseData.length > 20 ||
                vm.pulseLabels.length > 20 ||
                vm.spo2Data.length > 20 ||
                vm.spo2Labels.length > 20
              ) {
                vm.pulseData.shift();
                vm.pulseLabels.shift();
                vm.spo2Data.shift();
                vm.spo2Labels.shift();
              }
              // Settings of the two charts with their respective data gathered before.
              vm.pulseChartData = {
                labels: vm.pulseLabels,
                datasets: [
                  {
                    label: "Pulse",
                    borderColor: "#36d7e7",
                    pointBackgroundColor: "white",
                    borderWidth: 2,
                    pointBorderColor: "#36d7e7",
                    backgroundColor: "transparent",
                    pointRadius: 0,
                    data: vm.pulseData,
                  },
                ],
              };
              vm.spo2ChartData = {
                labels: vm.pulseLabels,
                datasets: [
                  {
                    label: "Spo2",
                    borderColor: "#36c1e7",
                    pointBackgroundColor: "white",
                    borderWidth: 2,
                    pointBorderColor: "#36c1e7",
                    backgroundColor: "transparent",
                    pointRadius: 0,
                    data: vm.spo2Data,
                  },
                ],
              };
              vm.lastPulse = vm.lastPulseCompute;
              vm.lastSpo2 = vm.lastSpo2Compute;
              vm.loaded = true;
            }
          })
          .catch(function (error) {
            console.log("AXIOS ERROR: " + error);
          })
          .finally(() => (this.loading = false));
        await this.$nextTick();
      }
    },
    // When the PulseOxy component is deactivated, the data is cleared and the refreshing timer is stopped.
    beforeDestroy() {
      clearInterval(this.timer),
        (this.pulseData = []),
        (this.spo2Data = []),
        (this.pulseChartData = null),
        (this.spo2ChartData = null);
    },
  },
};
</script>

<style>
.notOkPulseOxyColor {
  margin: 20px 0 20px;
  align-self: stretch;
  background-color: red;
  color: white;
}
.pulseColor {
  margin: 20px 0 20px;
  align-self: stretch;
  background-color: #36d7e7;
  color: white;
}
.spo2Color {
  margin: 20px 0 20px;
  align-self: stretch;
  background-color: #36c1e7;
  color: white;
}
.small {
  max-height: 220px;
  margin: 20px 0 20px;
}
.bigFont {
  font-size: 64px;
}
</style>

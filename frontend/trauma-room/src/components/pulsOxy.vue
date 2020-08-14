<template>
  <div>
    <div class="row align-items-start">
      <div class="col-12">
        <form class="form-inline" style="align-items: center;">
          <div class="col-9">
            <puls-oxy-line
              class="small"
              v-if="loaded"
              :chart-data="pulseData"
              :chart-labels="pulseLabels"
            />
          </div>
          <div class="col-3 pulseColor">
            <br />
            <b>Pulse</b>
            <br />
            <span
              v-if="lastPulse > 130 || lastpulse < 60"
              class="bigFont notOkPulseOxy"
            >{{ lastPulse }}</span>
            <span v-else class="bigFont">{{ lastPulse }}</span>
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
            <puls-oxy-line
              class="small"
              v-if="loaded"
              :chart-data="spo2Data"
              :chart-labels="spo2Labels"
            />
          </div>
          <div class="col-3 spo2Color">
            <br />
            <b>
              SpO
              <sub>2</sub>
            </b>
            <br />
            <span
              v-if="lastSpo2 > 110 || lastSpo2 < 90"
              class="bigFont notOkPulseOxy"
            >{{ lastSpo2 }}</span>
            <span v-else class="bigFont">{{ lastSpo2 }}</span>
            O
            <sub>2</sub>
            <br />SpO
            <sub>2</sub>%
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PulsOxyLine from "./pulsOxyLine.vue";
const axios = require("axios");

export default {
  name: "LineChartContainer",
  components: { PulsOxyLine },
  data() {
    return {
      loaded: false,
      timer: "",
      pulseData: [],
      pulseLabels: [],
      spo2Data: [],
      spo2Labels: [],
    };
  },
  mounted() {
    this.fillData();
  },
  created() {
    // this.timer = setInterval(this.fillData, 10000);
  },
  computed: {
    lastPulse() {
      var lastPulseData = this.pulseData[this.pulseData.length - 1];
      this.$root.$emit("lastPulseData", lastPulseData);
      return lastPulseData;
    },
    lastSpo2() {
      var lastSpo2Data = this.spo2Data[this.spo2Data.length - 1];
      this.$root.$emit("lastSpo2Data", lastSpo2Data);
      return lastSpo2Data;
    },
  },
  methods: {
    fillData() {
      var vm = this;
      this.loading = true;

      var body = "";

      var config = {
        method: "get",
        url: "http://134.155.48.211:3000/patient/findPulsoxyByPatientId/1",
        headers: {},
        data: body,
      };

      axios(config)
        .then(function (response) {
          if (response.data.statusCode === "10000") {
            vm.pulseData.push(response.data.data.pulsrate.toString());
            // vm.$pulseData.update(),
            vm.pulseLabels.push(response.data.data.timestamp.slice(11, 19));
            vm.spo2Data.push(response.data.data.spo2.toString());
            vm.spo2Labels.push(response.data.data.timestamp.slice(11, 19));
            vm.loaded = true;
          }
        })
        .catch(function (error) {
          console.log("AXIOS ERROR: " + error);
        });
      vm.loaded = true;

      // .finally(() => (this.loading = false));
    },
    beforeDestroy() {
      clearInterval(this.timer), (this.pulseData = []), (this.spo2Data = []);
    },
  },
};
</script>

<style>
.notOkPulseOxy {
  color: red;
}
.small {
  max-height: 220px;
  margin: 20px 0 20px;
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
.bigFont {
  font-size: 64px;
}
</style>

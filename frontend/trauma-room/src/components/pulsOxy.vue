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
            <span class="bigFont">{{lastPulse}}</span>
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
            <span class="bigFont">{{ lastSpo2 }}</span>
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
import PulsOxy_data1 from "../assets/PulsOxy_data1.json";
// import io from "socket.io-client";
// var socket = io.connect("http://localhost:4000");
export default {
  name: "LineChartContainer",
  components: { PulsOxyLine },
  data() {
    return {
      loaded: false,
      pulseData: [],
      pulseLabels: [],
      spo2Data: [],
      spo2Labels: [],
      jsonData: PulsOxy_data1,
    };
  },
  mounted() {
    this.fillData();
  },
  created() {
    // this.getRealtimeData()
  },
  computed: {
    lastPulse() {
      return this.pulseData[this.pulseData.length - 1];
    },
    lastSpo2() {
      return this.spo2Data[this.spo2Data.length - 1];
    },
  },
  methods: {
    fillData() {
      for (var data of this.jsonData) {
        this.pulseData.push(data.pulsoxy.pulsRate.value.toString());
        this.pulseLabels.push(data.pulsoxy.pulsRate.time);
        this.spo2Data.push(data.pulsoxy.spo2.value.toString());
        this.spo2Labels.push(data.pulsoxy.spo2.time);
      }
      this.loaded = true;
      // this.chartdata = {
      //   datasets: [
      //     {
      //       label: "Puls",
      //       backgroundColor: "#1A73E8",
      //       data: [fetchedData]
      //     },
      //     {
      //       label: "SpO2",
      //       backgroundColor: "#2b7518",
      //       data: [fetchedData]          }
      //   ]
      // };
    },
    getRealtimeData() {
      // socket.on("newdata", fetchedData => {
      //   this.fillData(fetchedData)
      // })
    },
  },
  // async mounted () {
  //   this.loaded = false
  //   try {
  //     const { userlist } = await fetch('/api/userlist')
  //     this.chartdata = userlist
  //     this.loaded = true
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
};
</script>

<style>
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

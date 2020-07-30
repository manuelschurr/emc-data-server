<template>
  <div>
    <div class="btn-group-vertical" data-toggel="buttons" role="group">
      <button
        @click="setSelection($event)"
        id="btn-puls"
        class="btn btn-secondary"
        :class="toggleButton(showComponentPulsoxy)"
      >
        Puls Oxy
        <br />
        Puls: {{lastPulse}}
        <br />
        SpO2: {{lastSpo2}}
      </button>
      <button
        @click="setSelection($event)"
        id="btn-stream"
        class="btn btn-secondary"
        :class="toggleButton(showComponentStream)"
      >Live Bild</button>
      <button
        @click="setSelection($event)"
        id="btn-position"
        class="btn btn-secondary"
        :class="toggleButton(showComponentMap)"
      >
        Position
        <br />
        ETA: {{ arrivalTime ? arrivalTime : "-" | secToTime }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showComponentMap: false,
      showComponentStream: false,
      showComponentPulsoxy: false,
      pastEvent: null,
      selection: [],
      lastPulse: null,
      lastSpo2: null,
    };
  },
  mounted() {
    this.$root.$on("lastPulseData", (data) => {
      this.lastPulse = data;
    });
    this.$root.$on("lastSpo2Data", (data) => {
      this.lastSpo2 = data;
    });
  },
  props: {
    arrivalTime: Number,
  },
  methods: {
    setSelection(event) {
      if (event.currentTarget.id === "btn-puls") {
        this.showComponentPulsoxy = !this.showComponentPulsoxy;
      } else if (event.currentTarget.id === "btn-stream") {
        this.showComponentStream = !this.showComponentStream;
      } else if (event.currentTarget.id === "btn-position") {
        this.showComponentMap = !this.showComponentMap;
      }
      this.pastEvent = event.currentTarget.id;
      if (!this.selection.includes(event.currentTarget.id)) {
        this.selection.push(event.currentTarget.id);
      } else {
        let index = this.selection.indexOf(event.currentTarget.id);
        if (index > -1) {
          this.selection.splice(index, 1);
        }
      }
      this.$root.$emit("selectedComponent", this.selection);
    },
    toggleButton(status) {
      let buttonClass = "";
      if (status) {
        buttonClass = "okABCDE";
      }
      return buttonClass;
    },
  },
  filters: {
    secToTime: function (value) {
      var seconds = Math.floor(value % 60).toString();
      var minutes = Math.floor(value / 60).toString();
      if (seconds.length === 1) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    },
  },
};
</script>
<style scoped>
.okABCDE {
  background-color: lightgreen;
}
.notOkABCDE {
  background-color: red;
}
</style>
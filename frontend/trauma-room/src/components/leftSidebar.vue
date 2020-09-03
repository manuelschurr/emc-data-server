<template>
  <div>
    <div class="btn-group-vertical" data-toggel="buttons" role="group">
      <button
        @click="setSelection($event)"
        id="multi-selection"
        class="btn btn-secondary"
        :disabled="showComponentMultiSelection"
        :class="toggleButton(showComponentMultiSelection)"
      >
        Gesamtübersicht
      </button>
      <button
        @click="setSelection($event)"
        id="btn-puls"
        class="btn btn-secondary"
        :disabled="showComponentPulseoxy"
        :class="toggleButton(showComponentPulseoxy)"
      >
        Puls Oxy
        <br />
        Puls: {{ lastPulse }}
        <br />
        SpO2: {{ lastSpo2 }}
      </button>
      <button
        @click="setSelection($event)"
        id="btn-stream"
        class="btn btn-secondary"
        :disabled="showComponentStream"
        :class="toggleButton(showComponentStream)"
      >
        Live Bild
      </button>
      <button
        @click="setSelection($event)"
        id="btn-position"
        class="btn btn-secondary"
        :disabled="showComponentMap"
        :class="toggleButton(showComponentMap)"
      >
        Position
        <br />
        ETA: {{ arrivalTime ? arrivalTime : "Fehler bei Routen Schnittstelle" }}
      </button>
      <PulseOxy v-if="false" />
      <Stream v-if="false" />
      <Maps v-if="false" />
    </div>
  </div>
</template>

<script>
import PulseOxy from "./pulseOxy.vue";
import Stream from "./stream.vue";
import Maps from "./maps.vue";
export default {
  data() {
    return {
      showComponentMap: false,
      showComponentStream: false,
      showComponentPulseoxy: false,
      showComponentMultiSelection: false,
      pastEvent: null,
      selection: [],
      lastPulse: null,
      lastSpo2: null
    };
  },
  components: {
    PulseOxy,
    Stream,
    Maps
  },
  mounted() {
    this.$root.$on("selectedComponent", data => {
      if (data === "btn-puls") {
        this.selection = [];
        this.selection.push(PulseOxy);
      } else if (data === "btn-stream") {
        this.selection = [];
        this.selection.push(Stream);
      } else if (data === "btn-position") {
        this.selection = [];
        this.selection.push(Maps);
      } else if (data === "multi-selection") {
        this.selection = [];
        this.selection.push(Maps);
        this.selection.push(Stream);
        this.selection.push(PulseOxy);
      }
    });

    this.$root.$on("lastPulseData", data => {
      this.lastPulse = data;
    });
    this.$root.$on("lastSpo2Data", data => {
      this.lastSpo2 = data;
    });
    this.$watch(
      "arrivalTime",
      arrivalTime => {
        this.arrivalTime = arrivalTime;
      },
      { immediate: true }
    );
    this.setSelection({
      currentTarget: {
        id: "multi-selection"
      }
    });
  },
  props: {
    arrivalTime: String
  },
  methods: {
    setSelection(event) {
      //var component = null;

      if (event.currentTarget.id === "btn-puls") {
        this.showComponentPulseoxy = !this.showComponentPulseoxy;
        this.showComponentMap = false;
        this.showComponentStream = false;
        this.showComponentMultiSelection = false;
        this.selection = [];
        this.selection.push(PulseOxy);
        //component = PulseOxy;
      } else if (event.currentTarget.id === "btn-stream") {
        this.showComponentStream = !this.showComponentStream;
        this.showComponentPulseoxy = false;
        this.showComponentMap = false;
        this.showComponentMultiSelection = false;
        this.selection = [];
        this.selection.push(Stream);
      } else if (event.currentTarget.id === "btn-position") {
        this.showComponentMap = !this.showComponentMap;
        this.showComponentPulseoxy = false;
        this.showComponentStream = false;
        this.showComponentMultiSelection = false;
        this.selection = [];
        this.selection.push(Maps);
      } else if (event.currentTarget.id === "multi-selection") {
        this.showComponentMultiSelection = !this.showComponentMultiSelection;
        this.showComponentPulseoxy = false;
        this.showComponentStream = false;
        this.showComponentMap = false;
        this.selection = [];
        this.selection.push(Maps);
        this.selection.push(Stream);
        this.selection.push(PulseOxy);
      }

      this.$root.$emit("selectedComponent", this.selection);
    },
    pushComponentToList(comp) {
      if (!this.selection.includes(comp)) {
        this.selection.push(comp);
      } else {
        let index = this.selection.indexOf(comp);
        if (index > -1) {
          this.selection.splice(index, 1);
        }
      }
    },
    toggleButton(status) {
      let buttonClass = "";
      if (status) {
        buttonClass = "okABCDE";
      }
      return buttonClass;
    }
  }
};
</script>
<style scoped>
.okABCDE {
  background-color: #5cb85c;
}
.notOkABCDE {
  background-color: red;
}
</style>
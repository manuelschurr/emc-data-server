<template>
  <div class="container">
    <div v-if="componentArray.length === 1">
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        ></component>
      </div>
    </div>
    <div
      v-else-if="componentArray.length === 2"
      style="position: absolute; left: 0; margin-left: 10px; margin: auto;"
    >
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        ></component>
      </div>
    </div>
    <div
      class="row"
      style="position: absolute; left: 0; margin-left: 10px;"
      v-else-if="componentArray.length > 2"
    >
      <maps
        :Rtwdocument="Rtwdocument"
        :patientId="patientId"
        :selectedElements="componentArray.length"
        class="col"
      >
      </maps>
    </div>
    <div
      class="row"
      style="position: absolute; left: 0; top: 30vh; width: 80%;"
      v-if="componentArray.length > 2"
    >
      <div class="col">
        <stream
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        >
        </stream>
      </div>
      <div class="col">
        <pulse-oxy
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        >
        </pulse-oxy>
      </div>
    </div>
  </div>
</template>

<script>
import PulseOxy from "./pulseOxy.vue";
import Stream from "./stream.vue";
import Maps from "./maps.vue";
export default {
  components: {
    PulseOxy,
    Stream,
    Maps
  },
  data() {
    return {
      componentArray: []
    };
  },
  props: {
    Rtwdocument: Object,
    patientId: Number
  },
  mounted() {
    // Set the initial components that are active and store the information in global variables
    this.componentArray = [Maps, Stream, PulseOxy];
    this.$root.$emit("selectedComponent", "multi-selection");
    // listen to the number of selected compoennts to enable styling options in dependence of the selected components. it also activats the PulsOxy component to ensure that it is always active,
    // even when the component is not selected. This is needed to transmit the recent PulsOxy Data to the LeftSideBar.
    this.$root.$on("selectedComponent", data => {
      this.componentArray = data;
      if (
        this.componentArray.length == 1 &&
        this.componentArray[0] != PulseOxy
      ) {
        this.componentArray.push(PulseOxy);
      }
    });
  }
};
</script>
<style scoped></style>

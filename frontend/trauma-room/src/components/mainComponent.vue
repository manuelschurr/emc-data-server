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
    <div v-else-if="componentArray.length === 2">
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        ></component>
      </div>
    </div>
    <div class="row" v-else-if="componentArray.length > 2">
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :patientId="patientId"
          :selectedElements="componentArray.length"
        ></component>
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
    Maps,
  },
  data() {
    return {
      componentArray: [],
    };
  },
  props: {
    Rtwdocument: Object,
    patientId: Number,
  },
  mounted() {
    this.componentArray = [Maps, Stream, PulseOxy];
    this.$root.$emit("selectedComponent", "multi-selection");

    this.$root.$on("selectedComponent", (data) => {
      this.componentArray = data;
      if (
        this.componentArray.length == 1 &&
        this.componentArray[0] != PulseOxy
      ) {
        this.componentArray.push(PulseOxy);
      }
    });
  },
};
</script>
<style scoped></style>

<template>
  <div class="container">
    <div v-if="componentArray.length === 1">
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :selectedElements="componentArray.length"
        ></component>
      </div>
    </div>
    <div class="row" v-if="componentArray.length >= 2">
      <div v-for="child in componentArray" :key="child.name">
        <component
          :is="child"
          :Rtwdocument="Rtwdocument"
          :selectedElements="componentArray.length"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import PulsOxy from "./pulsOxy.vue";
import Stream from "./stream.vue";
import Maps from "./maps.vue";
//import MainComponent from "./components/mainComponent.vue";
export default {
  components: {
    PulsOxy,
    Stream,
    Maps
  },
  data() {
    return {
      componentArray: []
    };
  },
  props: {
    Rtwdocument: Object
  },
  mounted() {
    this.componentArray = [Maps, Stream];
    this.$root.$emit("selectedComponent", "btn-position + btn-stream");

    this.$root.$on("selectedComponent", data => {
      this.componentArray = data;
      /*       console.log(data[0]);
      this.$forceUpdate(); */
    });
  }
};
</script>
<style scoped>
</style>
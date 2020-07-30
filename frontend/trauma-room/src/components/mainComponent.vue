<template>
  <div class="container">
    <div v-if="componentArray.length === 1">
      <div v-for="child in componentArray" :key="child.name">
        <component :is="child" :Rtwdocument="Rtwdocument"></component>
      </div>
    </div>
    <div class="row" v-if="componentArray.length === 2">
      <div v-for="child in componentArray" :key="child.name">
        <div class="col-4">
          <component :is="child" :Rtwdocument="Rtwdocument"></component>
        </div>
      </div>
    </div>
    <div class="row" v-if="componentArray.length === 3">
      <div class="col" v-for="child in componentArray" :key="child.name">
        <component :is="child" :Rtwdocument="Rtwdocument"></component>
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
    this.$root.$on("selectedComponent", data => {
      this.componentArray = [];
      for (var d of data) {
        console.log(d);
        if (d === "btn-puls") {
          this.componentArray.push(PulsOxy);
        }
        if (d === "btn-stream") {
          this.componentArray.push(Stream);
        }
        if (d === "btn-position") {
          this.componentArray.push(Maps);
        }
      }
    });
  }
};
</script>
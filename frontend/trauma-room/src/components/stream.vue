<template>
  <div class="gallery" id="mainDiv" v-if="this.loading">
    <div class="gallery">
      <div class="gallery-panel">
        <img v-bind:src="chosenImage" width="100%" />
      </div>
    </div>
    <div class="row">
      <div class="itemSpacing" v-for="screenshot in captures" :key="screenshot">
        <img v-on:click="clickMethod($event)" v-bind:src="screenshot" height="87" />
      </div>
    </div>
    <!-- <div class="canvas" id="galleryCanvas"></div> -->
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "camera",
  data() {
    return {
      captures: [],
      chosenImage: null,
      loading: false,
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    clickMethod: function (event) {
      this.chosenImage = event.currentTarget.src;
    },
    async fillData() {
      var vm = this;
      this.loading = true;
      // The first server request is to find the patient by the given patient ID
      var body = "";
      var config = {
        method: "get",
        url: "https://localhost:3000/img/all",
        // "https://134.155.48.211:3000/img/all",
        headers: {},
        data: body,
      };

      axios(config).then(function (response) {
        if (response.data.statusCode === "10000") {
          console.log("Images " + response.data.data);
          var imageStrings = response.data.data;
          for (var image of imageStrings) {
            var bodyTwo = "";
            console.log("Images " + JSON.stringify(image));
            var configGetImages = {
              method: "get",
              url: "https://localhost:3000/img/single/" + image,
              // "https://134.155.48.211:3000/img/single/" + image,
              responseType: "blob",
              headers: {},
              data: bodyTwo,
            };
            axios(configGetImages).then(function (responseImages) {
              if (response.data.statusCode === "10000") {
                var pic = URL.createObjectURL(responseImages.data);
                vm.captures.push(pic);
                vm.chosenImage = vm.captures[0];
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.itemSpacing {
  margin: 5px 2px 0px 2px;
}
</style>

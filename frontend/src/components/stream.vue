<template>
  <div v-if="selectedElements <= 2">
    <div
      class="gallery"
      id="mainDiv"
      v-if="this.loading && this.captures.length != 0"
    >
      <div class="gallery-panel">
        <img v-bind:src="chosenImage" width="100%" />
      </div>
      <div class="row">
        <div
          class="itemSpacing"
          v-for="screenshot in captures"
          :key="screenshot"
        >
          <img
            v-on:click="clickMethod($event)"
            v-bind:src="screenshot"
            height="87"
          />
        </div>
      </div>
    </div>
    <div v-else>Aktuell wurden noch keine Bilder gemacht</div>
  </div>
  <div v-else>
    <div
      class="gallery"
      id="mainDiv"
      v-if="this.loading && this.captures.length != 0"
    >
      <div class="gallery-panel">
        <img v-bind:src="chosenImage" width="70%" />
      </div>
    </div>
    <div v-else>Aktuell wurden noch keine Bilder gemacht</div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "camera",
  data() {
    return {
      captures: [],
      imageStrings: [],
      chosenImage: null,
      loading: false,
      token: ""
    };
  },
  props: {
    selectedElements: Number
  },
  mounted() {
    this.$root.$on("token", data => {
      this.token = data;
    });

    this.fillData();
  },
  created() {
    this.timer = setInterval(this.fillData, 5000);
  },
  methods: {
    clickMethod: function(event) {
      this.chosenImage = event.currentTarget.src;
    },
    async fillData() {
      var vm = this;
      this.loading = true;

      var body = "";
      var config = {
        method: "get",
        //"https://localhost:3000/img/all",
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/img/all",
        headers: { "x-access-token": this.token },
        data: body
      };

      axios(config).then(function(response) {
        if (response.data.statusCode === "10000") {
          var newImageStrings = response.data.data;
          var newToAdd = [];
          for (var image of newImageStrings) {
            if (!vm.imageStrings.includes(image)) {
              vm.imageStrings.push(image);
              newToAdd.push(image);
            }
          }
          for (var imageStr of newToAdd) {
            var bodyTwo = "";
            var configGetImages = {
              method: "get",
              //"https://localhost:3000/img/single/" + imageStr,
              url:
                "https://wifo1-29.bwl.uni-mannheim.de:3000/img/single/" +
                imageStr,
              responseType: "blob",
              headers: { "x-access-token": this.token },
              data: bodyTwo
            };
            axios(configGetImages).then(function(responseImages) {
              if (response.data.statusCode === "10000") {
                var pic = URL.createObjectURL(responseImages.data);
                vm.captures.push(pic);
                vm.chosenImage = vm.captures[vm.captures.length - 1];
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.itemSpacing {
  margin: 5px 2px 0px 2px;
}
.row {
  margin: 0px 0px;
}
</style>

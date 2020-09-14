<template>
  <div v-if="selectedElements <= 2">
    <div class="gallery" id="mainDiv" v-if="this.loading && this.captures.length != 0">
      <div class="gallery-panel">
        <img v-bind:src="chosenImage" width="100%" />
      </div>
      <div class="row">
        <div class="itemSpacing" v-for="screenshot in captures" :key="screenshot">
          <img v-on:click="clickMethod($event)" v-bind:src="screenshot" height="87" />
        </div>
      </div>
    </div>
    <div v-else>
      <br />Aktuell wurden noch keine Bilder gemacht
      <br />
    </div>
  </div>
  <div v-else>
    <div class="gallery" id="mainDiv" v-if="this.loading && this.captures.length != 0">
      <div class="gallery-panel">
        <img v-bind:src="chosenImage" width="70%" />
      </div>
    </div>
    <div v-else>
      <br />Aktuell wurden noch keine Bilder gemacht
      <br />
    </div>
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
      token: "",
      timer: "",
    };
  },
  props: {
    patientId: Number,
    selectedElements: Number,
  },
  mounted() {
    var context = this;
    var axios = require("axios");
    var data = {
      username: "root",
      password: "root",
    };

    var config = {
      method: "post",
      url: "https://wifo1-29.bwl.uni-mannheim.de:3000/user/login",
      headers: {},
      data: data,
    };

    axios(config)
      .then(function (response) {
        context.token = response.data.data.token;
        context.fillData();
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  // 5 seconds timer which triggers a refresh to get the new data/images from the server.
  created() {
    this.timer = setInterval(this.fillData, 5000);
  },
  // When the Stream component is deactivated, the refreshing timer is stopped.
  beforeDestroy() {
      clearInterval(this.timer);
    },
  methods: {
    retrieveToken() {},
    // Changes the big displayed picture to the selected one in the list of small pictures.
    clickMethod: function (event) {
      this.chosenImage = event.currentTarget.src;
    },
    // Retrieves the data from the server by first checking if new images are on the server and then depending on the 
    // file name, downloads the new picture to get it displayed in the component.
    async fillData() {
      var vm = this;
      this.loading = true;

      var body = "";
      var config = {
        method: "get",
        url: "https://wifo1-29.bwl.uni-mannheim.de:3000/img/all",
        headers: { "x-access-token": this.token },
        data: body,
      };

      axios(config).then(function (response) {
        if (response.data.statusCode === "10000") {
          var newImageStrings = response.data.data;
          var newToAdd = [];
          for (var image of newImageStrings) {
            if (image.split("-")[0] == vm.patientId) {
              if (!vm.imageStrings.includes(image)) {
                vm.imageStrings.push(image);
                newToAdd.push(image);
              }
            }
          }
          for (var imageStr of newToAdd) {
            var bodyTwo = "";
            var configGetImages = {
              method: "get",
              url:
                "https://wifo1-29.bwl.uni-mannheim.de:3000/img/single/" +
                imageStr,
              responseType: "blob",
              headers: { "x-access-token": vm.token },
              data: bodyTwo,
            };
            axios(configGetImages).then(function (responseImages) {
              if (response.data.statusCode === "10000") {
                var pic = URL.createObjectURL(responseImages.data);
                vm.captures.push(pic);
                vm.chosenImage = vm.captures[vm.captures.length - 1];
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
.row {
  margin: 0px 0px;
}
</style>

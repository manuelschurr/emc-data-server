<template>
  <div class="camera" v-bind:style="styleObject">
    <video autoplay controls class="feed">
      <p>Aktuell läuft kein Livestream.</p>
    </video>
    <button
      class="btn btn-dark btn-lg"
      style="margin-top: 7px; margin-bottom: 7px;"
      @click="this.takePicture"
    >
      <i class="fa fa-camera"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "camera",
  props: {
    selectedElements: Number
  },
  methods: {
    // initialize Webcam Livestream
    initVideo() {
      if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
      ) {
        // set ratio to 16:9
        let constraints = {
          video: {
            width: {
              min: 640,
              ideal: 1280,
              max: 1920
            },
            height: {
              min: 360,
              ideal: 720,
              max: 1080
            }
          }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          const videoPlayer = document.querySelector("video");
          videoPlayer.srcObject = stream;
          videoPlayer.play();
        });
      } else {
        alert("Kein Livestream verfügbar aktuell...");
      }
    },
    /*
     *Screenshot of Livestream
     */
    takePicture() {
      // pick canvas element to "draw" screenshot on
      const pic = document.querySelector("canvas");
      const ctx = pic.getContext("2d");
      // setting picture quality and landscape
      let ratio = window.innerHeight < window.innerWidth ? 16 / 9 : 9 / 16;
      // set window width to max. of 1280px
      pic.width = window.innerWidth < 1280 ? window.innerWidth : 1280;
      pic.height = window.innerWidth / ratio;
      // screenshot variable draws image
      var screenshot = ctx.drawImage(
        document.querySelector("video"),
        0,
        0,
        pic.width,
        pic.height
      );
      // // array where all screenshots shall be stored
      // var images = [];
      // var screenshotCanvas = document.getElementById("galleryCanvas");
      // for (var i = 0; i <= images.length; i++) {
      //     images.push(screenshot[i]);
      //     var screenshotsDisplay = document.createElement("IMG");
      //     screenshotsDisplay.setAttribute("src", images[i]);
      //     screenshotCanvas.appendChild(screenshotsDisplay);
      // }
      // array where all screenshots shall be stored
      // var images = [];
      // var screenshotCanvas = document.getElementById("galleryCanvas");
      // for (var i = 0; i <= images.length; i++) {
      //     images.push(screenshot[i]);
      //     var screenshotsDisplay = document.createElement("CANVAS");
      //     screenshotsDisplay.setAttribute("src", images[i]);
      //     screenshotCanvas.appendChild(screenshotsDisplay);
      // }
      // array where all screenshots shall be stored
      var images = new Array();
      var screenshotCanvas = document.getElementById("galleryCanvas");
      for (var i = 0; i <= images.length; i++) {
        images[i] = new Image();
        images[i].src = screenshot[i];
        var screenshotsDisplay = document.createElement("IMG");
        screenshotsDisplay.setAttribute("src", images[i].src);
        screenshotCanvas.appendChild(screenshotsDisplay);
      }
    }
  },
  //Webcam shall be initialized when Livestream Button is selected
  mounted() {
    this.initVideo();
  },
  computed: {
    styleObject: function() {
      if (this.selectedElements === 1) {
        return {
          width: "55vw",
          height: "25vh",
          padding: "25px",
          "box-sizing": "border-box;"
        };
      } else {
        return {
          width: "32vw",
          height: "25vh",
          padding: "25px",
          "box-sizing": "border-box;"
        };
      }
    }
  }
};
</script>

<style scoped>
.camera {
  width: 65vw;
  height: 25vh;
  padding: 25px;
  box-sizing: border-box;
}

.feed {
  display: block;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #171717;
}
</style>

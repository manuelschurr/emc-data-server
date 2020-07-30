<template>
  <div class="camera">
    <video autoplay controls class="feed">
      <p>Aktuell läuft kein Livestream.</p>
    </video>
    <!--- <button class="snap" @click="$emit('takePicture')"> -->
    <button class="btn btn-warning btn-lg" style="margin-top: 15px; margin-bottom: 15px" @click="this.takePicture">
      <b>Screenshot</b>
    </button>
  </div>
</template>

<script>

export default {
  name: "camera",
  methods: {
    // initialize Webcam Livestream
    init() {
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
    // Screenshot of Livestream
    takePicture() {
      // display pictures on Gallery Canvas
      const pic = document.querySelector("canvas");
      // setting picture quality and landscape
      let ratio = window.innerHeight < window.innerWidth ? 16 / 9 : 9 / 16;
      // if window width is smaller then 1280px then take its width, else 1280px - same for height
      pic.width = window.innerWidth < 1280 ? window.innerWidth : 1280;
      pic.height = window.innerWidth / ratio;
      const ctx = pic.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        document.querySelector("video"),
        0,
        0,
        pic.width,
        pic.height
      );
    }
  },
  //Webcam shall be initialized when Livestream Button is selected
  mounted() {
    this.init();
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
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.25);
  margin: 0 auto;
  background-color: #171717;
}
</style>
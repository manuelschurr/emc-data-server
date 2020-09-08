<template>
  <div>
    <div>
      <div class="container">
        <div
          class="carousel slide"
          id="main-carousel"
          data-interval="false"
          data-ride="carousel"
        >
          <ol class="carousel-indicators">
            <li
              data-target="#main-carousel"
              data-slide-to="0"
              class="active"
            ></li>

            <li data-target="#main-carousel" data-slide-to="1"></li>
            <li data-target="#main-carousel" data-slide-to="2"></li>
            <li data-target="#main-carousel" data-slide-to="3"></li>
          </ol>
          <!-- /.carousel-indicators -->

          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                class="d-block img-fluid"
                src="../assets/ambulance.png"
                alt
              />
              <div class="carousel-caption d-none d-md-block"></div>
            </div>
            <div class="carousel-item">
              <img
                class="d-block img-fluid"
                src="../assets/project_logo.png"
                alt
              />
              <div class="carousel-caption d-none d-md-block"></div>
            </div>
            <div class="carousel-item">
              <img class="d-block img-fluid" src="../assets/umm_logo.png" alt />
              <div class="carousel-caption d-none d-md-block"></div>
            </div>
            <div class="carousel-item">
              <img
                src="../assets/project_logo.png"
                alt
                class="d-block img-fluid"
              />
              <div class="carousel-caption d-none d-md-block"></div>
            </div>
          </div>
          <!-- /.carousel-inner -->
          <a
            href="#main-carousel"
            class="carousel-control-prev"
            data-slide="prev"
          >
            <span class="carousel-control-prev-icon"></span>
            <span class="sr-only" aria-hidden="true">Prev</span>
          </a>
          <a
            href="#main-carousel"
            class="carousel-control-next"
            data-slide="next"
          >
            <span class="carousel-control-next-icon"></span>
            <span class="sr-only" aria-hidden="true">Next</span>
          </a>
        </div>
      </div>
      <!-- <video ref="video" id="video" width="1024" height="576" autoplay></video> -->
      <!-- <div>
      <button
        class="btn btn-dark btn-lg"
        style="margin-top: 5px; margin-bottom: 7px"
        id="snap"
        v-on:click="capture()"
      >
        <i class="fa fa-camera"></i>
      </button>
    </div>-->
      <!-- <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    <ul>
      <li v-for="c in captures" :key="c.id">
        <img v-bind:src="c" height="50" />
      </li>
    </ul>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "camera",
  data() {
    return {
      captures: [
        {
          src: "../assets/umm_logo.png",
          index: 1,
        },
        {
          src: "../assets/ambulance.png",
          index: 2,
        },
        {
          src: "../assets/project_logo.png",
          index: 3,
        },
        {
          src: "../assets/umm_team_logo.png",
          index: 4,
        },
      ],
    };
  },
};
//   props: {
//     selectedElements: Number,
//   },
//   mounted() {
//     this.initVideo();
//   },
//   methods: {
//     initVideo() {
//       this.video = this.$refs.video;
//       if (
//         "mediaDevices" in navigator &&
//         "getUserMedia" in navigator.mediaDevices
//       ) {
//         // set ratio to 16:9
//         // if (this.selectedElements == 3) {
//         //   let constraints = {
//         //     video: {
//         //       width: {
//         //         min: 640,
//         //         ideal: 1280,
//         //         max: 1920,
//         //       },
//         //       height: {
//         //         min: 360,
//         //         ideal: 720,
//         //         max: 1080,
//         //       },
//         //     },
//         //   };
//         // } else {
//         let constraints = {
//           video: {
//             width: {
//               min: 640,
//               ideal: 1280,
//               max: 1920,
//             },
//             height: {
//               min: 360,
//               ideal: 720,
//               max: 1080,
//             },
//           },
//         };
//         // }
//         navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//           const videoPlayer = document.querySelector("video");
//           videoPlayer.srcObject = stream;
//           videoPlayer.play();
//         });
//       } else {
//         alert("Kein Livestream verfügbar aktuell...");
//       }
//     },
//     capture() {
//       // this.canvas = this.$refs.canvas;
//       //this.canvas = document.querySelector("canvas");
//       this.canvas = document.getElementById("galleryCanvas");
//       var context = this.canvas.getContext("2d");
//       context.drawImage(this.video, 0, 0, 640, 480);
//       this.captures.push(this.canvas.toDataURL("image/png"));
//       this.$root.$emit("selectScreenshots", this.captures);
//     },
//   },
// };
</script>

<style scoped>
/* #app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: aqua;
} */
/* #video {
  background-color: #000000;
} */
/* #canvas {
  display: none;
} */
/* li {
  display: inline;
  padding: 5px;
} */
/* .darkColor {
  color: #000000;
} */
.carousel-inner img {
  margin: auto;
}
.carousel-control-next {
  background-color: rgba(160, 160, 160, 0.24);
}
.carousel-control-prev {
  background-color: rgba(160, 160, 160, 0.24);
}
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}
</style>

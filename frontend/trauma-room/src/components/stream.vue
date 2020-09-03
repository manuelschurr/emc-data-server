<template>
    <div id="app">
        <div>
            <video ref="video" id="video" width="1024" height="576" autoplay></video>
        </div>
        <div>
            <button class="btn btn-dark btn-lg" style="margin-top: 5px; margin-bottom: 7px" id="snap" v-on:click="capture()">
                <i class="fa fa-camera"></i>
            </button>
        </div>
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
        <ul>
            <li v-for="c in captures" :key="c.id">
                <img v-bind:src="c" height="50" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "camera",
    data() {
        return {
            video: {},
            canvas: {},
            captures: [],
        };
    },
    mounted() {
        this.initVideo();
    },
    methods: {
        initVideo() {
            this.video = this.$refs.video;
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
                            max: 1920,
                        },
                        height: {
                            min: 360,
                            ideal: 720,
                            max: 1080,
                        },
                    },
                };
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then((stream) => {
                        const videoPlayer = document.querySelector("video");
                        videoPlayer.srcObject = stream;
                        videoPlayer.play();
                    });
            } else {
                alert("Kein Livestream verfügbar aktuell...");
            }
        },
        capture() {
            // this.canvas = this.$refs.canvas;
            //this.canvas = document.querySelector("canvas");
            this.canvas = document.getElementById("galleryCanvas");
            var context = this.canvas.getContext("2d");
            context.drawImage(this.video, 0, 0, 640, 480);
            this.captures.push(this.canvas.toDataURL("image/png"));
            this.$root.$emit("selectScreenshots", this.captures);
        },
    },
};
</script>

<style scoped>
#app {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
#video {
    background-color: #000000;
}
#canvas {
    display: none;
}
li {
    display: inline;
    padding: 5px;
}
</style>
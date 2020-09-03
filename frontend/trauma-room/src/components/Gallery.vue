<template>
    <div class="gallery" id="mainDiv">
        <canvas ref="canvas" class="galleryCanvas" id="galleryCanvas" width="640" height="480" :captures="capture"></canvas>
        <ul>
            <li v-for="screenshot in captures" :key="screenshot.id">
                <img v-bind:src="screenshot" height="50" />
            </li>
        </ul>
        <!-- <div class="canvas" id="galleryCanvas"></div> -->
    </div>
</template>

<script>
// Gallery for storing and displaying all screenshots taken
export default {
    name: "gallery",

    props: {
        captures: Array,
    },
};

// ToDo: Array aus Bilder Scrollable
// ToDo: Modal Image on click
</script>

<style scoped>
#canvas {
    display: none;
}
li {
    display: inline;
    padding: 5px;
}
/* .gallery {
    display: block;
    padding: 25px;
    box-sizing: border-box;
}
.galleryCanvas {
    display: block;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    box-shadow: 1px 1px 12px 0px;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: justify;
    overflow: scroll;
} */
</style>
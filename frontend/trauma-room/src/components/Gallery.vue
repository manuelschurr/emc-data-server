<template>
    <div class="gallery" id="mainDiv">
        <canvas class="galleryCanvas" id="galleryCanvas"></canvas>
        <!-- <div class="canvas" id="galleryCanvas"></div> -->
    </div>
</template>

<script>
// Gallery for storing and displaying all screenshots taken
export default {
    name: "gallery",
};

// ToDo: Array aus Bilder Scrollable
// ToDo: Modal Image on click
</script>

<style scoped>
.gallery {
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
}
</style>
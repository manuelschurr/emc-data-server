<template>
  <div class="gallery">
    <canvas id="galleryCanvas"></canvas>
  </div>
</template>

<script>
// Gallery for storing and displaying all screenshots taken
export default {
  name: "gallery"
};
</script>

<style scoped>
.gallery {
  display: block;
  padding: 25px;
  box-sizing: border-box;
}
canvas {
  display: block;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  box-shadow: 4px 4px 12px 0px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: justify;
}
</style>
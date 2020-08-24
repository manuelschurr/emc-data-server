<template>
  <div>
    <!-- Gallery for Screenshots -->
    <b>
      <u>Screenshots</u>
    </b>
    <Gallery />
  </div>
</template>

<script>
import Gallery from "./Gallery";
export default {
  components: {
    Gallery
  },
  data() {
    return {
      output: ""
    };
  }
};
</script>


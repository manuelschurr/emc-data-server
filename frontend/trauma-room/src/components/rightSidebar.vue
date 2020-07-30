<template>
  <div>
    <!-- Notes zu ABCDE -->
    {{ output }}
    <!-- Gallery for Screenshots -->
    <b>Screenshots</b>
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
  },
  mounted() {
    this.$root.$on("textABCDE", data => {
      this.output = data;
    });
    
  }
};
</script>


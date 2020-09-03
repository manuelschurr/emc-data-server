<template>
  <div>
    Notizen ABCDE-Schema:
    <div v-if="patient.status.a.notes">
      <b>A: </b>
      {{ patient.status.a.notes }}
    </div>
    <div v-if="patient.status.b.notes">
      <b>B: </b>
      {{ patient.status.b.notes }}
    </div>
    <div v-if="patient.status.c.notes">
      <b>C: </b>
      {{ patient.status.c.notes }}
    </div>
    <div v-if="patient.status.d.notes">
      <b>D: </b>
      {{ patient.status.d.notes }}
    </div>
    <div v-if="patient.status.e.notes">
      <b>E: </b>
      {{ patient.status.e.notes }}
    </div>

    <!-- Gallery for Screenshots -->
    <!--<b>
            <u>Screenshots</u>
        </b>
        < make border around screenshots with div 
        <canvas ref="canvas" class="galleryCanvas" id="galleryCanvas" width="640" height="480"></canvas>
        <ul>
            <li v-for="i in screenshots" :key="i.id">
                <img v-bind:src="i" height="50" />
            </li>
        </ul> 
        < <Gallery /> -->
  </div>
</template>

<script>
// import Gallery from "./Gallery";
export default {
  // components: {
  //     Gallery,
  // },
  data() {
    return {
      screenshots: [],
      output: "",
      patient: Object
    };
  },
  mounted() {
    // this.$root.emit("selectScreenshots", "captures");
    //this.$root.$on("selectScreenshots", data => {
    //this.screenshots = data;
    //});
    this.$root.$on("patientDataSidebar", data => {
      this.patient = data;
    });
  }
};
</script>


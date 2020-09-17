<template>
  <div>
    <div style="margin-right: 20px; margin-bottom: 10px;" class="mx-auto">
      <button
        type="button"
        class="btn btn-secondary"
        id="btn-a"
        :class="classABCDE(patient.status.a.isSelected)"
        disabled
        pill
      >
        A
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        id="btn-b"
        :class="classABCDE(patient.status.b.isSelected)"
        disabled
        pill
      >
        B
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        id="btn-c"
        :class="classABCDE(patient.status.c.isSelected)"
        disabled
        pill
      >
        C
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        id="btn-d"
        :class="classABCDE(patient.status.d.isSelected)"
        disabled
        pill
      >
        D
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        id="btn-e"
        :class="classABCDE(patient.status.e.isSelected)"
        disabled
        pill
      >
        E
      </button>
    </div>
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
      patient: {
        status: {
          a: {
            isSelected: null,
            notes: ""
          },
          b: {
            isSelected: null,
            notes: ""
          },
          c: {
            isSelected: null,
            notes: ""
          },
          d: {
            isSelected: null,
            notes: ""
          },
          e: {
            isSelected: null,
            notes: ""
          }
        }
      }
    };
  },
  mounted() {
    // this.$root.emit("selectScreenshots", "captures");
    //this.$root.$on("selectScreenshots", data => {
    //this.screenshots = data;
    //});

    //Retrieve the patient data from a sibling component
    this.$root.$on("patientDataSidebar", data => {
      this.patient = data;
    });
  },
  methods: {
    //Dynamically sets the color of the ABCDE-Buttons based on the selected value.
    classABCDE(status) {
      let classABCDE = "";
      if (status == null) {
        classABCDE = "rounded-circle btn-secondary";
      } else if (status) {
        classABCDE = "rounded-circle btn-success";
      } else {
        classABCDE = "rounded-circle btn-danger";
      }
      return classABCDE;
    }
  }
};
</script>


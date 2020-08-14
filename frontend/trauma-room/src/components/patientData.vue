<template>
  <div class="container-fluid patientData">
    <div class="row align-items-start">
      <h5 class="col patientDataText" style="text-align:start">Patientendaten</h5>
    </div>
    <div class="row align-items-start">
      <div class="col-10">
        <form class="form-inline" style="align-items:start">
          <div class="col-5">
            <div class="form-group row columnSpacing">
              <label for="patientName" class="col-4 col-form-label labelTitle">Name:</label>
              <div class="col-8">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  id="patientName"
                  v-model="patient.name"
                  v-if="loaded"
                />
              </div>
            </div>
            <div class="form-group row columnSpacing">
              <label for="patientGeschlecht" class="col-4 col-form-label labelTitle">Geschlecht:</label>
              <div class="col-8">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  id="patientGeschlecht"
                  v-model="patient.gender"
                  v-if="loaded"
                />
              </div>
            </div>
            <div class="form-group row columnSpacing">
              <label for="patientAlter" class="col-4 col-form-label labelTitle">Alter:</label>
              <div class="col-8">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  id="patientAlter"
                  v-model="patient.age"
                  v-if="loaded"
                />
              </div>
            </div>
            <div class="form-group row columnSpacing">
              <label
                for="patientVorerkrankungen"
                class="col-4 col-form-label labelTitle"
              >Vorerkrankungen:</label>
              <div class="col-8">
                <input
                  type="text"
                  readonly
                  class="form-control-plaintext"
                  id="patientVorerkrankungen"
                  v-model="patient.preExistingIllness.text"
                  v-if="loaded"
                />
              </div>
            </div>
          </div>
          <div class="col-7" style="align-items:start">
            <div class="form-group row labelTitle">
              <label>Sonstiges</label>
              <textarea
                class="form-control-plaintext"
                rows="4"
                v-model="patient.miscellaneaous.text"
                readonly
                v-if="loaded"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="col-2">
        <br />
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-a"
            @click="openABCDE(patient.status.a.notes, $event)"
            :class="classABCDE(patient.status.a.isSelected)"
            v-if="loaded"
          >A</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-b"
            @click="openABCDE(patient.status.b.notes, $event)"
            :class="classABCDE(patient.status.b.isSelected)"
            v-if="loaded"
          >B</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-c"
            @click="openABCDE(patient.status.c.notes, $event)"
            :class="classABCDE(patient.status.c.isSelected)"
            v-if="loaded"
          >C</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-d"
            @click="openABCDE(patient.status.d.notes, $event)"
            :class="classABCDE(patient.status.d.isSelected)"
            v-if="loaded"
          >D</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-e"
            @click="openABCDE(patient.status.e.notes, $event)"
            :class="classABCDE(patient.status.e.isSelected)"
            v-if="loaded"
          >E</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      loaded: false,
      timer: "",
      patient: {
        rtwId: "",
        name: "",
        age: "",
        gender: "",
        preExistingIllness: {
          text: "",
        },
        miscellaneaous: {
          text: "",
        },
        status: {
          a: {
            isSelected: false,
            notes: "Notes zu A",
          },
          b: {
            isSelected: false,
            notes: "Notes zu B",
          },
          c: {
            isSelected: false,
            notes: "Notes zu C",
          },
          d: {
            isSelected: false,
            notes: "Notes zu D",
          },
          e: {
            isSelected: false,
            notes: "Notes zu E",
          },
        },
      },
      showABCDE: false,
      pastEvent: null,
    };
  },
  mounted() {
    this.fillData();
  },
  created() {
    this.timer = setInterval(this.fillData, 10000);
  },
  methods: {
    fillData() {
      var vm = this;
      var data = "";

      var config = {
        method: "get",
        url: "http://134.155.48.211:3000/patient/findByAmbulanceId/1",
        headers: {},
        data: data,
      };

      axios(config)
        .then(function (response) {
          vm.patient.rtwId = response.data.data.ambulanceId;
          vm.patient.name = response.data.data.name;
          vm.patient.age = response.data.data.age;
          vm.patient.gender = response.data.data.gender;
          vm.patient.preExistingIllness.text =
            response.data.data.preExistingIllness;
          vm.patient.miscellaneaous.text = response.data.data.miscellaneous;
          vm.patient.status.a.isSelected = response.data.data.AIsSelected;
          vm.patient.status.a.notes = response.data.AText;
          vm.patient.status.b.isSelected = response.data.data.BIsSelected;
          vm.patient.status.b.notes = response.data.BText;
          vm.patient.status.c.isSelected = response.data.data.CIsSelected;
          vm.patient.status.c.notes = response.data.CText;
          vm.patient.status.d.isSelected = response.data.data.DIsSelected;
          vm.patient.status.d.notes = response.data.DText;
          vm.patient.status.e.isSelected = response.data.data.EIsSelected;
          vm.patient.status.e.notes = response.data.data.EText;
        })
        .catch(function (error) {
          console.log(error);
        });
      vm.loaded = true;
    },
    openABCDE(output, event) {
      if (!this.showABCDE || event.currentTarget.id !== this.pastEvent) {
        this.$root.$emit("textABCDE", output);
        this.showABCDE = true;
        this.pastEvent = event.currentTarget.id;
      } else if (event.currentTarget.id == this.pastEvent) {
        this.$root.$emit("textABCDE", "");
        this.showABCDE = false;
        this.pastEvent = event.currentTarget.id;
      }
    },
    classABCDE(status) {
      let classABCDE = "";
      if (status) {
        classABCDE = "notOkABCDE";
      } else {
        classABCDE = "okABCDE";
      }
      return classABCDE;
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
  },
};
</script>

<style scoped>
.okABCDE {
  background-color: lightgreen;
}
.notOkABCDE {
  background-color: red;
}
.patientData {
  margin: 3px;
  align-content: flex-start;
  border: 1px black;
  border-style: solid;
  border-radius: 5px;
}
.patientDataText {
  margin: 5px;
  font-weight: bold;
}
.labelTitle {
  justify-content: flex-start;
  padding: 0px;
  font-weight: 500;
}
.columnSpacing {
  height: 28px;
  text-align: center;
}
</style>
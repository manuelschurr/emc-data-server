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
                  v-model="patient.dateOfBirth"
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
          >A</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-b"
            @click="openABCDE(patient.status.b.notes, $event)"
            :class="classABCDE(patient.status.b.isSelected)"
          >B</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-c"
            @click="openABCDE(patient.status.c.notes, $event)"
            :class="classABCDE(patient.status.c.isSelected)"
          >C</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-d"
            @click="openABCDE(patient.status.d.notes, $event)"
            :class="classABCDE(patient.status.d.isSelected)"
          >D</button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-e"
            @click="openABCDE(patient.status.e.notes, $event)"
            :class="classABCDE(patient.status.e.isSelected)"
          >E</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patient: {
        rtwId: 123,
        name: "Test Name",
        dateOfBirth: "15.01.20",
        gender: "Test Geschlecht",
        preExistingIllness: {
          text: "Diabetis"
        },
        miscellaneaous: {
          text:
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        },
        status: {
          a: {
            isSelected: true,
            notes: "Notes zu A"
          },
          b: {
            isSelected: false,
            notes: "Notes zu B"
          },
          c: {
            isSelected: true,
            notes: "Notes zu C"
          },
          d: {
            isSelected: false,
            notes: "Notes zu D"
          },
          e: {
            isSelected: false,
            notes: "Notes zu E"
          }
        }
      },
      showABCDE: false,
      pastEvent: null
    };
  },
  methods: {
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
    }
  }
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
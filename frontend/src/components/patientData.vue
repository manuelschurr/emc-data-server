<template>
  <!-- eslint-disable prettier/prettier -->
  <div class="container-fluid patientData">
    <div v-if="showModal">
      <i class="fas fa-exclamation-triangle"></i>
      {{ message }}
    </div>
    <div class="row align-items-start">
      <h5 class="col patientDataText" style="text-align: start;">
        Patientendaten
      </h5>
      <div style="margin-right: 20px; margin-bottom: 10px;">
        <button
          type="button"
          class="btn btn-secondary"
          id="btn-a"
          :class="classABCDE(patient.status.a.isSelected)"
          v-if="loaded"
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
          v-if="loaded"
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
          v-if="loaded"
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
          v-if="loaded"
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
          v-if="loaded"
          disabled
          pill
        >
          E
        </button>
      </div>
    </div>
    <div class="row align-items-start">
      <div class="col-10">
        <form class="form-inline" style="align-items: start;">
          <div class="col-5">
            <div class="form-group row columnSpacing">
              <label for="patientName" class="col-4 col-form-label labelTitle"
                >Name:</label
              >
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
              <label
                for="patientGeschlecht"
                class="col-4 col-form-label labelTitle"
                >Geschlecht:</label
              >
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
              <label for="patientAlter" class="col-4 col-form-label labelTitle"
                >Alter:</label
              >
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
                >Vorerkrankungen:</label
              >
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
          <div class="col-7" style="align-items: start;">
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
        <!-- Audio nur oeffnen wenn audio ankommt ueber GET -->
        <div
          id="audioFile"
          class="audio"
          style="overflow-y: scroll; height: 12vh;"
          controls
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import axios from "axios";
//const axios = require("axios");
export default {
  data() {
    return {
      token: "",
      message: null,
      notesABCDE: "",
      showModal: false,
      loaded: false,
      timer: "",
      patient: {
        rtwId: "",
        name: "",
        age: "",
        gender: "",
        preExistingIllness: {
          text: ""
        },
        miscellaneaous: {
          text: ""
        },
        status: {
          a: {
            isSelected: Boolean,
            notes: ""
          },
          b: {
            isSelected: Boolean,
            notes: ""
          },
          c: {
            isSelected: Boolean,
            notes: ""
          },
          d: {
            isSelected: Boolean,
            notes: ""
          },
          e: {
            isSelected: Boolean,
            notes: ""
          }
        }
      },
      showABCDE: false,
      pastEvent: null
    };
  },
  props: {
    patientId: Number
  },
  mounted() {
    this.$root.$on("token", data => {
      this.token = data;
    });
    this.fillData();
    this.retrieveAudio();
  },
  // Refreshes the patient data every 10 seconds with the data from the server.
  created() {
    this.timer = setInterval(this.fillData, 10000);
  },
  methods: {
    // Requests the data from the server to get the patient data
    fillData() {
      var vm = this;
      var data = "";

      var config = {
        method: "get",
        url:
          "https://wifo1-29.bwl.uni-mannheim.de:3000/patient/findByPatientId/" +
          this.patientId,
        headers: { "x-access-token": this.token },
        data: data
      };

      axios(config)
        .then(function(response) {
          vm.patient.rtwId = response.data.data.ambulanceId;
          vm.patient.name = response.data.data.name;
          vm.patient.age = response.data.data.age;
          vm.patient.gender = response.data.data.gender;
          vm.patient.preExistingIllness.text =
            response.data.data.preExistingIllness;
          vm.patient.miscellaneaous.text = response.data.data.miscellaneous;
          vm.patient.status.a.isSelected = response.data.data.AIsSelected;
          vm.patient.status.a.notes = response.data.data.AText;
          vm.patient.status.b.isSelected = response.data.data.BIsSelected;
          vm.patient.status.b.notes = response.data.data.BText;
          vm.patient.status.c.isSelected = response.data.data.CIsSelected;
          vm.patient.status.c.notes = response.data.data.CText;
          vm.patient.status.d.isSelected = response.data.data.DIsSelected;
          vm.patient.status.d.notes = response.data.data.DText;
          vm.patient.status.e.isSelected = response.data.data.EIsSelected;
          vm.patient.status.e.notes = response.data.data.EText;
          vm.$root.$emit("patientDataSidebar", vm.patient);
          vm.showModal = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.showModal = true;
          vm.message = "Keine Patienten Daten verfügbar ";
        });
      vm.loaded = true;
    },
    /**
     * Methode zum Holen der Audio aus Server Backend
     */
    retrieveAudio() {
      axios({
        method: "get",
        url: "https://localhost:3000/audio/all"
      }).then(function(response) {
        console.log("Response Data Data: " + response.data.data);
        // for loop iterating over all items of the data object
        for (var audioFileName of response.data.data) {
          axios({
            method: "get",
            url: "https://localhost:3000/audio/single/" + audioFileName,
            responseType: "blob"
          }).then(function(response) {
            var audiofiles = response.data;
            const url = window.URL.createObjectURL(audiofiles);
            var audioDiv = document.getElementById("audioFile");
            var audioPlayer = document.createElement("AUDIO");
            // set attributes of audio element
            audioPlayer.setAttribute("controls", "controls");
            audioPlayer.setAttribute("preload", "auto");
            audioPlayer.setAttribute(
              "style",
              "display: inline-block; width: 13vw; height: 5vh;"
            );
            // append the audio player to audio container
            audioDiv.appendChild(audioPlayer);
            // set inner HTML of audio player to source of blop URL
            audioPlayer.innerHTML =
              "<p>1</p>" + '<source src="' + url + '" type="audio/mpeg" />';
          });
        }
      });
    },
    openABCDE(output, event) {
      console.log(output, event);
    },
    classABCDE(status) {
      let classABCDE = "";
      if (!status) {
        classABCDE = "rounded-circle btn-danger";
      } else {
        classABCDE = "rounded-circle btn-success";
      }
      return classABCDE;
    },
    // When the rtw is switched, the refreshing timer is stopped.
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
/* eslint-disable prettier/prettier */
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

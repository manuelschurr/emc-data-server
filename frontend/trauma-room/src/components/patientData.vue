<template>
  <div class="container-fluid patientData">
    <div v-if="showModal">
      <i class="fas fa-exclamation-triangle"></i>
      {{ message }}
    </div>
    <div class="row align-items-start">
      <h5 class="col patientDataText" style="text-align: start;">
        Patientendaten
      </h5>
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
        <div id="audioFile" class="audio" controls></div>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-a"
            @click="openABCDE(patient.status.a.notes, $event)"
            :class="classABCDE(patient.status.a.isSelected)"
            v-if="loaded"
          >
            A
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-b"
            @click="openABCDE(patient.status.b.notes, $event)"
            :class="classABCDE(patient.status.b.isSelected)"
            v-if="loaded"
          >
            B
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-c"
            @click="openABCDE(patient.status.c.notes, $event)"
            :class="classABCDE(patient.status.c.isSelected)"
            v-if="loaded"
          >
            C
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-d"
            @click="openABCDE(patient.status.d.notes, $event)"
            :class="classABCDE(patient.status.d.isSelected)"
            v-if="loaded"
          >
            D
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            id="btn-e"
            @click="openABCDE(patient.status.e.notes, $event)"
            :class="classABCDE(patient.status.e.isSelected)"
            v-if="loaded"
          >
            E
          </button>
        </div>
        <div>
          <div class="form-group row labelTitle">
            <label>ABCDE-Notizen</label>
            <textarea
              class="form-control-plaintext"
              rows="2"
              v-model="notesABCDE"
              readonly
              v-if="loaded"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
//const axios = require("axios");
export default {
  data() {
    return {
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
          "https://134.155.48.211:3000/patient/findByPatientId/" +
          this.patientId,
        headers: {},
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
          vm.patient.status.a.notes = response.data.AText;
          vm.patient.status.b.isSelected = response.data.data.BIsSelected;
          vm.patient.status.b.notes = response.data.BText;
          vm.patient.status.c.isSelected = response.data.data.CIsSelected;
          vm.patient.status.c.notes = response.data.CText;
          vm.patient.status.d.isSelected = response.data.data.DIsSelected;
          vm.patient.status.d.notes = response.data.DText;
          vm.patient.status.e.isSelected = response.data.data.EIsSelected;
          vm.patient.status.e.notes = response.data.data.EText;
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
      // muss natuerlich noch die eigentliche Serveradresse + fiel+ID
      axios({
        method: "get",
        url: "https://localhost:3000/audio/single/2020-08-05_15-38-13.mp3",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "audio/mpeg"
        }
      })
        .then(function(response) {
          console.log("Axios GET " + response.data);
          const blob = new Blob([response.data], {
            type: "audio/mpeg"
          });
          const url = window.URL.createObjectURL(blob);
          // access audio container and create audio player element in it
          var audioDiv = document.getElementById("audioFile");
          var audioPlayer = document.createElement("AUDIO");
          // console.log("AudioPlayer " + audioPlayer);
          // set attributes of audio element
          audioPlayer.setAttribute("controls", "controls");
          audioPlayer.setAttribute("preload", "auto");
          audioPlayer.setAttribute(
            "style",
            "display: inline-block; width: 15vw; "
          );
          // append the audio player to audio container
          audioDiv.appendChild(audioPlayer);
          // set inner HTML of audio player to source of blop URL
          audioPlayer.innerHTML =
            '<source src="' + url + '" type="audio/mpeg" />';
        })
        .catch(function(error) {
          console.log("Axios GET " + error);
        });
    },
    openABCDE(output, event) {
      if (!this.showABCDE || event.currentTarget.id !== this.pastEvent) {
        this.notesABCDE = output;
        this.showABCDE = true;
        this.pastEvent = event.currentTarget.id;
      } else if (event.currentTarget.id == this.pastEvent) {
        this.notesABCDE = "";
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
    // When the rtw is switched, the refreshing timer is stopped.
    beforeDestroy() {
      clearInterval(this.timer);
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
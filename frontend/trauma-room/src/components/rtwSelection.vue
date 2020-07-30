<template>
  <div class="rtw_selection">
    <div>
      <h1>
        <img
          style="vertical-align: text-top;"
          alt="Universitätsklinikum Mannheim logo"
          src="../assets/umm_logo.png"
          height="50"
          width="150"
        />
        Universitätsklinikum Mannheim
      </h1>
      <ul v-if="ambulances.length">
        <li v-for="ambulance in ambulances" v-bind:key="ambulance.id">
          <p>
            <button @click="selectRTW">
              <img src="../assets/ambulance.png" width="100" />
              <br />
              <br />
              RTW - {{ ambulance.name }}
              <br />
              ETA: {{ ambulance.eta }} Minuten
              <br />
              Diagnose: {{ ambulance.diagnosis }}
              <br />
              <ul>
                <li
                  v-for="(value, name) in ambulance.abcde_schema"
                  v-bind:key="name"
                >
                  <div class="text-center">
                    <button
                      v-if="value === true"
                      disabled
                      pill
                      class="rounded-circle notOkABCDE"
                    >
                      {{ name }}
                    </button>
                    <button
                      v-else-if="value === false"
                      disabled
                      pill
                      class="rounded-circle okABCDE"
                    >
                      {{ name }}
                    </button>
                  </div>
                </li>
              </ul>
            </button>
          </p>
        </li>
      </ul>
      <h3 v-else>... Aktuell fahren keine RTW's das UMM an ...</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "RtwSelection",
  props: {
    selectRTW: Function,
  },
  data: () => ({
    ambulances: [
      {
        id: 1,
        name: "DRK",
        eta: 3.35,
        diagnosis: "Gebrochenes Bein",
        abcde_schema: { A: false, B: false, C: true, D: true, E: false },
      },
      {
        id: 2,
        name: "Malteser",
        eta: 2.45,
        diagnosis: "Gebrochenes Bein",
        abcde_schema: { A: false, B: true, C: false, D: true, E: false },
      },
      {
        id: 3,
        name: "ASB",
        eta: 6.05,
        diagnosis: "Gebrochenes Bein",
        abcde_schema: { A: false, B: false, C: true, D: true, E: true },
      },
    ],
  }),
};
</script>

<style scoped>
h1 {
  margin: 5px 0 40px;
}
h3 {
  margin: 100px 0 0;
}
ul {
  list-style-type: none;
  padding: 5px;
}
li {
  display: inline-block;
  margin: 5px 5px;
}
.okABCDE {
  background-color: lightgreen;
}
.notOkABCDE {
  background-color: lightcoral;
}
</style>

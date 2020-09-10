import Vue from "vue";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

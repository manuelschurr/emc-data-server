import Vue from "vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'leaflet/dist/leaflet.css';

import App from "./App.vue";


Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
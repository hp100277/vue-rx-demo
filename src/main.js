import Vue from "vue";
import VueRx from "vue-rx";
import App from "./App.vue";
import router from "./router";
import store from "./store";
Vue.use(VueRx);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

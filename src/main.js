import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/vi";
Vue.use(ElementUI, { locale });

import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

import "@/styles/index.scss"; // global css

import "./middleware";

import * as filters from "./utils/filters";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

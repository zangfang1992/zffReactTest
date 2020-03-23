import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './vuex/store'
// import ElementUI from 'element-ui';
import './css/reset.css'
import './css/resetEle.less'
// process.env.NODE_ENV === 'development' && import('./mock')
// Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

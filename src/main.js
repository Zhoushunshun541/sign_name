import Vue from "vue";
import { Button, Message } from "element-ui";
import App from "./App.vue";

Message.install = function(Vue) {
  Vue.prototype.$message = Message;
};
Vue.use(Button);
Vue.use(Message);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

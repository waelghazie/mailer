import Vue from 'vue'
import App from './App.vue'
import router from './router/index';

import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
import VueMq from './plugins/mq';

new Vue({
  router,
  vuetify,
  VueMq,
  render: function (h) { return h(App) }
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import {MessageViewerConsole} from './MessageViewerConsole';
import {Repository} from './Repository.mock';

new MessageViewerConsole();
new Repository();

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

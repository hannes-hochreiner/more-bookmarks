import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import {MessageViewerConsole} from './MessageViewerConsole';
import RepositoryWorker from 'worker-loader!./RepositoryWorker';

Vue.config.productionTip = false

let initMessages = [
  {action: 'repositoryReady', type: 'broadcast'}
];

let bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
bc.onmessage = function(event) {
  initMessages = initMessages.filter(function(elem) {
    return !(elem.action == event.data.action && elem.type == event.data.type);
  });

  if (initMessages.length == 0) {
    bc.close();
    new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
}

new MessageViewerConsole();
new RepositoryWorker();

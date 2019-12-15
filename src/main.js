import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import {default as uuid} from 'uuid/v4';
import {PubSub} from './PubSub';
import {MessageViewerConsole} from './MessageViewerConsole';
import RepositoryWorker from 'worker-loader!./RepositoryWorker';

let ps = new PubSub('net.hochreiner.more-bookmarks', uuid);

Vue.config.productionTip = false
Vue.use((Vue) => {
  Vue.mixin({
    created: function() {
      this.$ps = new PubSub('net.hochreiner.more-bookmarks', uuid);
    }
  });
});

new MessageViewerConsole();
new RepositoryWorker();

awaitInitRepo(ps).then(() => {
  new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
});

function awaitInitRepo(ps) {
  return new Promise(resolve => {
    let token = ps.subscribe({action: 'repositoryReady', type: 'broadcast'}, () => {
      ps.unsubscribe(token);
      resolve();
    });
  });
}

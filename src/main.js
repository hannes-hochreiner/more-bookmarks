import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import {default as uuid} from 'uuid/v4';
import {PubSub, PubSubFactory} from './PubSub';
import {ViewModelFactory} from './ViewModelFactory';
import {MessageViewerConsole} from './MessageViewerConsole';
import RepositoryWorker from 'worker-loader!./RepositoryWorker';

let ps = new PubSub('net.hochreiner.more-bookmarks', uuid);

Vue.config.productionTip = false
Vue.use((Vue) => {
  Vue.mixin({
    created: function() {
      this.$vmf = new ViewModelFactory(new PubSubFactory('net.hochreiner.more-bookmarks', uuid), uuid);
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

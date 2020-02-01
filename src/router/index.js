import Vue from 'vue'
import VueRouter from 'vue-router'
import Bookmarks from '../views/Bookmarks.vue'
import Authentication from '../views/Authentication.vue'
import {default as uuid} from 'uuid/v4';
import {PubSub} from '../PubSub';

let ps = new PubSub('net.hochreiner.more-bookmarks', uuid);

Vue.use(VueRouter);

const routes = [
  {path: '/', component: Bookmarks},
  {path: '/tree/:treeId', component: Bookmarks},
  {path: '/tree/:treeId/group/:groupId', component: Bookmarks},
  {path: '/authentication', component: Authentication},
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (to.path == '/authentication') {
    next();
    return;
  }

  let isAuth = await ps.oneshot({type: 'request', action: 'isAuthenticated'});

  if (isAuth.result) {
    next();
  } else {
    next('/authentication');
  }
});

ps.subscribe({type: 'broadcast', action: 'navigateTo'}, function(data) {
  router.push(data.url);
});

export default router;

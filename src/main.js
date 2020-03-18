// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'

import Goods from 'components/goods/goods'
import Rating from 'components/ratings/rating'
import Seller from 'components/seller/seller'
// import NoFound from 'components/other/404'
import 'common/stylus/index.styl'// 全局样式引用

Vue.config.devtools = true;
Vue.config.productionTip = false;// 阻止启动生产消息 调试窗口处显示
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({
  routes: [
    {path: '/', component: Goods},
    {path: '/goods', name: 'goods', component: Goods},
    {path: '/rating', component: Rating},
    {path: '/seller', component: Seller},
    {path: '*', redirect: '/'}
  ],
  mode: 'history',
  linkActiveClass: 'active'//  替换vue-link 自带的样式名
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})

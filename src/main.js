// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Goods from 'components/goods/goods'
import Rating from 'components/ratings/rating'
import Seller from 'components/seller/seller'
import Order from 'components/order/order'
import Login from 'components/login/login'
import Register from 'components/login/register'
import VueScroller from 'vue-scroller'
// import {testAPI} from '@/common/js/httpAPI'
// import NoFound from 'components/other/404'
import 'common/stylus/index.styl'// 全局样式引用

Vue.config.devtools = true;
Vue.config.productionTip = false;// 阻止启动生产消息 调试窗口处显示
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(VueScroller)
const router = new VueRouter({
  routes: [
    {path: '/', component: Goods},
    {path: '/goods', name: 'goods', component: Goods},
    {path: '/order', component: Order},
    {path: '/rating', component: Rating},
    {path: '/seller', component: Seller},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '*', redirect: '/'}
  ],
  mode: 'history',
  linkActiveClass: 'active'//  替换vue-link 自带的样式名
})
// 全局守卫
router.beforeEach((to, from, next) => {
  // 判断是否已登录 并拦截
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    if (localStorage.getItem('userName')) {
      next();
    } else {
      next('/login');
    }
      // console.log('begin api')
      // testAPI('/api/test').then(result => {
      //   console.log(result)
      // }).catch(error => {
      //   console.log('catch error')
      //   console.log(error.error)
      //   // let result = error.response.data;
      //   // this.$message(result.msg);
      //   // next('/login');
      // })
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})

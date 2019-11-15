// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResoure from 'vue-resource'
import goods from './components/goods/goods'
import seller from './components/seller/seller'
import ratings from './components/ratings/ratings'

import "./common/stylus/index.styl"

Vue.config.productionTip = false
Vue.use(VueRouter)
// Vue.use({vm})
Vue.use(VueResoure)


const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];

let router = new VueRouter({
  // mode:'history',//用于去掉#号
  linkActiveClass:'active',
  routes
});

var vm =new Vue({
  el:'#app',
  router,
  render:h=>h(App)
  
})







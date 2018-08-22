import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body)
/* eslint-disable no-new */
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})

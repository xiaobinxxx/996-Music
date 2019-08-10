import Vue from 'vue'
import axios from 'axios'
import path from 'path'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import util from './tool/util'
import VueLazyload from 'vue-lazyload'
import './assets/img/404.png'
Vue.use(ElementUI)
Vue.use(VueLazyload)
// 工具
Vue.prototype.$util = util;
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: path.join(__dirname,'/assets/img/404.png'),
  loading: path.join(__dirname,'/assets/img/404.png'),
  attempt: 1
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

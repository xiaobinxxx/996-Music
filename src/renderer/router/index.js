import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 首页
    {
      path: '/',
      name: 'home',
      component: require('@/components/home').default
    },
    {
      path: '*',
      redirect: '/',
    },

  ]
})

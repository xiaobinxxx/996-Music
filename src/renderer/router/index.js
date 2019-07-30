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
      redirect: '/'
    },
    {
      path: '/LandingPage',
      name: 'LandingPage',
      component: require('@/components/LandingPage').default
    },
    // 遥控器页面
    {
      path: '/RemoteControl',
      name: 'RemoteControl',
      component: require('@/components/RemoteControl').default
    },
  ]
})

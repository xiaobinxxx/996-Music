import Vue from 'vue'
import Vuex from 'vuex'

import ColorSwitch from './modules/ColorSwitch'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  modules:{
    ColorSwitch,
  },
  plugins: [
    createPersistedState(),
  ],
  strict: process.env.NODE_ENV !== 'production'
})

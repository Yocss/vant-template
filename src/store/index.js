import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import { vuex, cookie as Cookie } from '@axmine/helper'
import config from '@/app.config.js'
const cookie = new Cookie('sessionStorage')
console.log(vuex)
const actions = Object.assign(vuex.actions, {
  SetToken ({ commit }, token) {
    this.dispatch('SetStore', { token })
    const tk = config.keys.token || ''
    const t = config.keys.cookie || 0
    if (token) {
      t && tk && cookie.set(tk, token, t)
      window.sessionStorage.setItem(tk, token)
    } else {
      t && tk && cookie.remove(tk, token)
      window.sessionStorage.removeItem(tk)
    }
  }
})

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: vuex.mutations,
  actions
  // modules: {}
})

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import { cookie as Cookie } from '@axmine/helper'
import mutations from './mutations.js'

import config from '@/app.config.js'
const session = new Cookie('sessionStorage')
const actions = {
  SetStore ({ commit }, data) {
    commit('SET_STORE', data)
  },
  SetToken ({ commit }, token) {
    this.dispatch('SetStore', { token })
    const tk = config.keys.token || ''
    const t = config.keys.cookie || 0
    if (token) {
      tk && session.set(tk, token, t)
      window.sessionStorage.setItem(tk, token)
    } else {
      tk && session.remove(tk, token)
      window.sessionStorage.removeItem(tk)
    }
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
  // modules: {}
})

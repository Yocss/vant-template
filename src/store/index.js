import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import config from '@/app.config.js'
import { setCookie, delCookie } from '@/assets/js/utils/cookie.js'

const actions = {
  SetStore ({ commit }, data) {
    commit('SET_STORE', data)
  },
  SetToken ({ commit }, token) {
    this.dispatch('SetStore', { token })
    const tk = config.keys.token || ''
    const t = config.keys.cookie || 0
    if (token) {
      t && tk && setCookie(tk, token, t)
      window.sessionStorage.setItem(tk, token)
    } else {
      t && tk && delCookie(tk, token)
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

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state.js'
import mutations from './mutations.js'

const actions = {
  SetStore ({ commit }, data) {
    commit('SET_STORE', data)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions
  // modules: {}
})

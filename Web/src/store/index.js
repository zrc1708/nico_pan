import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username:'',
    id:''
  },
  mutations: {
    setUsernameValue(state,val){
      state.username = val
    },
    setIdValue(state,val){
      state.id = val
    },
  },
  actions: {
  },
  modules: {
  }
})

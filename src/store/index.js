import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {}
  },
  getters: {
    hasRole ( state, role ) {
      state;
      role;
      return true
    },
    userName (state) {
      state;
      return "Hubert Gołębiowski"
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

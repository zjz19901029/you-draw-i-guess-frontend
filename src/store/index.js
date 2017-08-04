import Vue from 'vue'
import Vuex from 'vuex'
import LS from '../utils/LocalStorage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    selectedServer:null,
    serverInfo: {
      host: '10.100.33.129',
      id: '',
      port: 3010
    },
    maxRoomPlayers: 6,
    connected: false,
    pomelo: pomelo
  },
  mutations: {
    setUserInfo (state, user) {
      state.userInfo = user
    },
    setMaxRoomPlayers (state, num) {
      state.maxRoomPlayers = num
    },
    connected (state) {
      state.connected = true
    },
    disconnect (state) {
      state.connected = false
      state.pomelo.disconnect()
    },
    setServerInfo (state, param) {
      state.serverInfo = Object.assign({},state.serverInfo,param)
    },
    setSelectedServer (state, param) {
      state.selectedServer = Object.assign({},state.selectedServer,param)
    }
  },
  actions: {
    login ({commit, state}, user) {
      commit('SAVE_USER', user)
    },
    connect ({commit, state}, param) {
      if(state.connected = true){//当前状态已连接，先断开连接
        commit('disconnect')
      }
      state.pomelo.init({
        host: state.serverInfo.host,
        port: state.serverInfo.port,
        log: true
      }, function() {
        commit('connected')
        param.callback&&param.callback()
      })
    }
  },
  getters: {
    user: state => {
      return state.user || LS.get('user') || {}
    }
  }
})

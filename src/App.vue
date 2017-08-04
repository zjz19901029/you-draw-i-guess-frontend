<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    getParams () {
      let search = window.location.search
      search = search && search.substr(1)
      let pv = search.split('&')
      let param = {}
      pv.forEach(pvStr => {
        let p = pvStr.split('=')
        param[p[0]] = p[1]
        return param
      })
      return param
    },
    getUserInfo () {
      let userInfo = {
        name:"test",
        avatar:"",
        uid: new Date().getTime()
      }
      this.$store.commit("setUserInfo",userInfo)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getUserInfo()
      let param = vm.getParams()
      vm.$router.replace({path: '/' + (param.page || 'index')})
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

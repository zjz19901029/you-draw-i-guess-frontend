<template>
  <div>
    <ul class="server-list">
      <li v-for="server in servers" @click="choseServer(server)" :class="{'selected':server.selected}">{{server.name}}</li>
    </ul>
    <mt-button type="primary" @click="enterServer">进入游戏</mt-button>
  </div>
</template>

<script>
import CONFIG  from '../config/config.json'
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      servers: [],
      selectedServer:{}
    }
  },
  created () {
    this.loading()
    this.$store.commit("setServerInfo",{
      host:CONFIG.host,
      port:CONFIG.port
    })
    this.$store.dispatch("connect",{
      callback :() => {
        this.loaded()
        this.loadServers()
      }
    })
  },
  methods: {
    loadServers () {
      let route = 'gate.gateHandler.queryEntry'
      this.$store.state.pomelo.request(route, (data) => {
        if (data.code === 500) {
          //showError(LOGIN_ERROR)
          return
        }
        if(data.serversInfo&&data.serversInfo.length>0){
          data.serversInfo.forEach((s)=>{
            s.selected = false
          })
          data.serversInfo.sort((a,b) => {
            let aId = +a.id.split("-")[2]
            let bId = +b.id.split("-")[2]
            return aId>bId
          })
          data.serversInfo[0].selected = true
          this.servers = data.serversInfo
          this.selectedServer = data.serversInfo[0]
        }
      })
    },
    refresh () {
      return this.loadServers()
    },
    choseServer (server) {
      if(server.selected == false){
        this.servers.forEach((s)=>{
          s.selected = false
        })
        server.selected = true
        this.selectedServer = server
      }
    },
    enterServer () {
      this.$store.commit("setServerInfo",{
        host: this.selectedServer.host,
        port: this.selectedServer.clientPort,
        id: this.selectedServer.id
      })
      this.loading('连接中...')
      this.$store.dispatch("connect",{
        callback: () => {
          this.$store.state.pomelo.request('connector.entryHandler.enterServer',this.$store.state.userInfo,
            data => {
              console.log(data)
              if(data.code == 500){
                MessageBox('提示',data.msg)
              }
              this.$router.push('roomlist')
              this.loaded()
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/less/base.less";
.server-list{
  width: 80%;
  margin: auto;
  height: 210px;
  border-radius: 5px;
  border: 1px #26a2ff solid;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 50px;
  li{
    width: 48%;
    float: left;
    height: 40px;
    line-height: 40px;
    border: 1px #26a2ff solid;
    border-radius: 5px;
    margin: 1%;
    color: #f00;
    &.selected{
      background:#26a2ff;
      color:#fff;
    }
  }
}

</style>

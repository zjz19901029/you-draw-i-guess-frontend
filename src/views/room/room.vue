<template>
<div class="wrap">
  <mt-header class="header" i="header">
    <mt-button slot="left" icon="back" @click="leaveRoom">离开房间</mt-button>
    <mt-button slot="right" >{{serverName}}-{{roomId+1}}号桌</mt-button>
  </mt-header>
  <div class="container" :style="{paddingRight:containerPad+'px'}">
    <div class="player-waiting" v-show="!isBegin">
      <ul class="player-list clearfix">
        <li v-for="(user,index) in userList" :key="user.uid" ><player-item :user="user" :class="{master: index === 0, me: me.uid === user.uid}"></player-item></li>
        <li class="empty-item" v-for="empty in playerNumber - userList.length"></li>
      </ul>
      <div class="begin-btn" v-if="isRoomMaster">
        <mt-button size="large" type="primary" :disabled="!canBegin" @click="beginGame">{{canBegin ? '开始游戏' : '至少两人才能开始'}}</mt-button>
      </div>
    </div>
    <div class="player-begin" :style="{width:containerPad+'px'}" v-if="isBegin">
      <begin @game-over="gameOver" ref="begin"></begin>
    </div>
    <div class="chat-area">
      <chat showList="1"></chat>
    </div>
  </div>
</div>
</template>
<!-- 进入房间后自动坐下，房主可开始游戏 -->
<script>
import PlayerItem from './PlayerItem'
import Chat from '../play/chat'
import Begin from '../play/begin'
export default {
  components: { Chat, PlayerItem ,Begin},
  beforeRouteEnter (to, from, next) {
    const roomId = to.params.id
    next(vm => {
      vm.loading()
      vm.$store.state.pomelo.request('connector.entryHandler.joinRoom',{
        userInfo:vm.$store.state.userInfo,
        rid:roomId
      },
      data => {
        vm.loaded()
        if(data.code == 500){
          vm.$message(data.msg)
          this.$router.replace({name:'roomlist'})
        }
        vm.roomId = +roomId
        vm.userList = data.userList
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.state.pomelo.notify('connector.entryHandler.leaveRoom')
    next()
  },
  data () {
    return {
      socketEvents: {
        onAdd ({user}) {
          this.refreshUser(user)
        },
        onGameBegin ({id}) {
          this.isBegin = true
        },
        onLeave ({user}) {
          this.userLeave(user.uid)
        }
      },
      isBegin:false,
      roomId: null,
      serverName: this.$store.state.selectedServer.name,
      userList: [],
      playerNumber: this.$store.state.maxRoomPlayers
    }
  },
  computed: {
    me () {
      return this.$store.state.userInfo
    },
    isRoomMaster () {
      const userId = this.me.uid
      const firstUser = this.userList[0]
      return firstUser && (firstUser.uid === userId)
    },
    emptyNum () {
      return this.playerNumber - this.userList.length
    },
    canBegin () {
      return this.userList.length > 1
    },
    containerPad () {
      if(this.isBegin){
        let drawAreaHeight = window.innerHeight - 40;
        let drawAreaWidth = drawAreaHeight*1.4;
        return drawAreaWidth
      }
      return 400
    }
  },
  methods: {
    beginGame () {
      this.$store.state.pomelo.notify('connector.entryHandler.beginGame')
    },
    refreshUser (user) {
      this.userList.push(user)
    },
    userLeave (uid) {
      let index = this.userList.findIndex(u => u.uid == uid)
      this.userList.splice(index,1)
      this.isBegin&&this.$refs.begin.userOffline(uid)
    },
    leaveRoom () {
      if(this.isBegin){
        this.$messageBox.confirm('确定退出当前正在进行的游戏?').then(action => {
          this.$router.replace({name:'roomlist'})
        });
      }else{
        this.$router.replace({name:'roomlist'})
      }
    },
    gameOver () {
      this.isBegin = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.wrap{
  padding-top: 40px;
  height: 100%;
}
.header{
  position:absolute;
  width:100%;
  left: 0;
  top:0;
}
.container{
  height: 100%;
  padding-right: 400px;
  position: relative;
  transition: all .5s;
}
.player-waiting,.player-begin{
  position: absolute;
  right: 0;
  top:0;
  width: 400px;
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.player-list{
  li{
    float: left;
    width: 29.3%;
    margin:2%;
    height: 115px;
    border: 1px #7dc7ff solid;
  }
  .empty-item{
    background: #eee;
  }
}
.begin-btn{
  width: 200px;
  margin: auto;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}
.chat-area{
  height: 100%; 
}
</style>

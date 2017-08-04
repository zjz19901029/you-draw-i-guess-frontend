<template>
  <div class="index">
    <mt-header :title="title">
      <mt-button slot="left" @click="leaveServer">返回</mt-button>
      <mt-button slot="right"><userAvatar :userInfo="userInfo" slot="icon"></userAvatar></mt-button>
    </mt-header>
    <ul class="room-list">
      <li class="room" v-for="(room,roomId) in roomList" :class="{'playing':room.state==1}">
        <div class="table" @click="joinRoom(roomId)">
          <div v-for="player in 6" class="seat">
            <userAvatar v-if="room.players&&room.players[player-1]" :userInfo="room.players[player-1]" :height="40" :width="40"></userAvatar>
          </div>
        </div>
        <p>-{{roomId+1}}-</p>
      </li>
    </ul>
  </div>
</template>
<script>
import userAvatar from '../components/userAvatar'
export default {
  components:{userAvatar},
  data () {
    return {
      socketEvents: {
        onServerAdd: this.userEnter,
        onServerLeave: this.userLeave,
        onRoomAdd: this.updateRoomAdd,
        onRoomLeave: this.updateRoomLeave
      },
      roomList: [],
      userList: [],
      allLoad: false
    }
  },
  created () {
    this.loadRoomList()
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    onlineUser () {
      return this.userList.length
    },
    title () {
      return `你画我猜-${this.$store.state.selectedServer.name}-游戏大厅(${this.onlineUser}人)`
    }
  },
  methods: {
    leaveServer () {
      this.$router.replace({path:'/'})
    },
    joinRoom (roomId) {
      if(this.roomList[roomId].state == 1){
        return
      }
      this.$router.replace({path:`room/${roomId}`})
    },
    loadRoomList () {
      this.$store.state.pomelo.request('connector.entryHandler.getServerInfo',this.$store.state.userInfo,
        data => {
          console.log(data)
          data.roomList.forEach((room) => {
            let index = room.players.findIndex(p => p.uid == this.userInfo.uid)
            if(index >=0){
              room.players.splice(index,1)
            }
          })
          this.roomList = data.roomList
          this.userList = data.userList
          this.$store.commit("setMaxRoomPlayers",this.roomList[0].maxPlayer)
      })
    },
    updateRoomAdd (data) {
      console.log(data)
      if(this.roomList[data.roomId]){
        this.roomList[data.roomId].players.push(data.user)
      }
    },
    updateRoomLeave (data) {
      console.log(data)
      if(this.roomList[data.roomId]){
        let index = this.roomList[data.roomId].players.findIndex(p => p.uid == data.user.uid)
        this.roomList[data.roomId].players.splice(index,1)
      }
    },
    refresh () {
      return this.loadRoomList()
    },
    userEnter (data) {
      this.userList.push(data.user)
    },
    userLeave (data) {
      let index = this.userList.findIndex(a => a.uid == data.user.uid)
      this.userList.splice(index,1)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/less/base.less";
.index{
  height: 100%;
  .room-list{
    overflow: auto;
    .room{
      float: left;
      width:33.3%;
      height: 190px;
      .table{
        background:url(../assets/img/table.png) center no-repeat;
        position: relative;
        width:160px;
        height: 160px;
        margin:auto;
        .seat{
          position: absolute;
          width:40px;
          height: 40px;
          border-radius: 50%;
          background: #ccc;
          &:nth-child(1){
            left: 10px;
            top: 30px;
          }
          &:nth-child(2){
            left: 57px;
            top: 5px;
          }
          &:nth-child(3){
            right: 10px;
            top: 30px;
          }
          &:nth-child(4){
            right: 10px;
            bottom: 30px;
          }
          &:nth-child(5){
            left: 57px;
            bottom: 5px;
          }
          &:nth-child(6){
            left: 10px;
            bottom: 30px;
          }
        }
      }
    }
  }
}
</style>

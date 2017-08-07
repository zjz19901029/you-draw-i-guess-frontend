<template>
<div class="game-begin">
  <header>
    <div class="tips">
      {{tip}}
    </div>
    <div class="time">
      {{countTime}}
    </div>
  </header>
  <draw :can-draw="isCurrentPlay" :image-data="gameData.imageData" ref="draw">
    <div class="fiexd-msg-list" slot="ondraw" ref="msgScroll" :style="{opacity:messageListShow ? 1 : 0}">
      <div class="msg-auto-scroll">
        <div class="msg-list-all" ref="msgList">
          <span v-for="msg in msgList" :class="msg.type">{{msg.msg}}</span>
        </div>
      </div>
    </div>
  </draw>
  <div v-show="!isCurrentPlay">
    <div class="player-list-wrap">
      <div class="player-list" :style="{width:players && players.length * 25 + '%'}">
        <player-item v-for="user in players" :user="user" :class="{me: user.uid === me, draw: user.id === currentPlayer, leave: isOffline(user.id)}"></player-item>
      </div>
    </div>
    <mt-popup v-model="isShowAnswerCard">
      <div class="answer-card" @click="hideAnswerCart">
        <div>
          <span>答案是:</span>
          <span class="answer">
            {{this.currentAnswer}}
          </span>
        </div>
        <div class="quick-send">
          点击快捷发送:
          <p v-for="msg in quickSend" @click="sendMsg(msg)">{{msg}}</p>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="isShowGameOver">
      <div class="answer-card">
        <div class="quick-send">
          <p v-for="u,index in gameOverData">
            第{{index+1}}名: {{u.username}} {{u.score}}分
          </p>
        </div>
      </div>
    </mt-popup>
  </div>
</div>
</template>

<script>
import Draw from './draw'
import PlayerItem from '../room/PlayerItem'
export default {
  components: { Draw, PlayerItem },
  beforeRouteLeave (to, from, next) {
    this.stopAutoScroll()
    next()
  },
  created () {
    this.getGameData()
  },
  data () {
    return {
      socketEvents: {
        onTimeout (data) {
          this.countTime = data.time
        },
        onAnswerType (data) {
          this.typeName = data.type
        },
        countScore (userScore) {
          const players = this.gameData.players
          if (players) {
            players.forEach(u => {
              u.score = userScore[u.id] || u.score
            })
          }
        },
        thisOver (data) {
          this.currentAnswer = data.answer.word
          this.isShowAnswerCard = true
          this.gameData.player = ''
        },
        changeGamer (data) {
          this.isShowAnswerCard = false
          this.typeName = ''
          this.gameData.imageData = ''
          this.getGameData()
        },
        userOffline ({id}) {
          this.offlineUser[id] = 1
          this.offlineUser = {...this.offlineUser}
        },
        userOnline ({id}) {
          delete this.offlineUser[id]
          this.offlineUser = {...this.offlineUser}
        },
        gameOver (data) {
          this.isShowAnswerCard = false
          this.isShowGameOver = true
          this.gameOverData = this.gameData.players.sort((u1, u2) => {
            return u1.score < u2.score
          })
        }
      },
      quickSend: [
        '666666666',
        '哈哈哈哈哈',
        '这画的什么鬼',
        '???????????',
        '简直无法直视',
        '你的画工和颜值成正比',
        '.................'
      ],
      isShowGameOver: false,
      isShowAnswerCard: false,
      offlineUser: {},
      currentAnswer: '',
      typeName: '',
      gameData: {},
      countTime: 60,
      msgList: [],
      speed: 10,
      userScore: {},
      scrollInterval: '',
      messageListShow: false,
      gameOverData: []
    }
  },
  watch: {
    currentPlayer (val) {
      if (this.isCurrentPlay) {
        this.$message('你来画')
      } else {
        this.players.every(u => {
          if (u.uid === this.currentPlayer) {
            this.$message(u.name + '作画')
            return false
          }
          return true
        })
      }
    }
  },
  computed: {
    players () {
      return this.gameData.players
    },
    me () {
      return this.$store.state.userInfo.uid
    },
    currentPlayer () {
      return this.gameData.players?this.gameData.players[this.gameData.currentPlayer].uid:""
    },
    isCurrentPlay () {
      return this.me === this.currentPlayer
    },
    tip () {
      if(this.isCurrentPlay){
        return "请画:" + this.gameData.answer.word
      }else{
        return "提示:" + this.gameData.answer.word.length + "个字  " + this.typeName
      }
    }
  },
  methods: {
    isOffline (id) {
      return this.offlineUser[id]
    },
    hideAnswerCart () {
      this.isShowAnswerCard = false
    },
    sendMsg (msg) {
      this.$refs.chat.send(msg)
    },
    getGameData () {
      this.loading()
      this.$store.state.pomelo.request('connector.entryHandler.getGameData',(data) => {
        this.gameData = data.gameData
        this.countTime = data.gameData.time
        console.log(gameData)
        this.loaded()
      })
    },
    startAutoScroll () {
      this.messageListShow = true
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval)
      }
      this.scrollInterval = setInterval(_ => {
        try {
          this.$refs.msgScroll.scrollLeft++
          if (this.$refs.msgScroll.scrollLeft >= this.$refs.msgList.clientWidth + this.$refs.msgScroll.clientWidth) {
            this.stopAutoScroll()
          }
        } catch (e) {
          console.error(e)
          this.stopAutoScroll()
        }
      }, this.speed)
    },
    stopAutoScroll () {
      this.messageListShow = false
      clearInterval(this.scrollInterval)
      this.$refs.msgScroll.scrollLeft = 0
      this.msgList = []
    },
    showMessage (msg) {
      this.msgList.push(msg)
      this.startAutoScroll()
    }
  }
}
</script>

<style lang="less">
@import "../../assets/less/base.less";
.answer-card{
  width: 100vw;
  padding: 2vw;
  text-align: center;
}
.answer{
  color: @main-color;
  font-size: 1.2em;
  margin-left: 10px;
}
.quick-send{
  p{
    margin: .2em;
    border: 1px solid @main-color;
    padding: 10px;
  }
}
.player-list{
  width: 100%;
  overflow: auto;
  .player-item{
    width: 25vw;
    display: inline-block;
    padding: 2vw;
  }
}
.fiexd-msg-list{
  position: absolute;
  bottom: 0;
  min-width: 100%;
  background: rgba(0, 0, 0, 0.13);
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  transition: all .5s;
  font-size: .9em;
}
.msg-auto-scroll{
  width: 10000%;
  margin-left: 80%;
  .msg-list-all{
    display: inline-block;
    span + span{
      padding-left: 30vw;
    }
  }
}
</style>

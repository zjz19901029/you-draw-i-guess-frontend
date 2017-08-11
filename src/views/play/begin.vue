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
  <div class="player-list">
    <player-list :players="players" :currentPlayer="currentPlayer"></player-list>
  </div>
  <mt-popup v-model="isShowAnswerCard">
    <div class="answer-card">
      <div>
        <span>答案是:</span>
        <span class="answer">
          {{this.currentAnswer}}
        </span>
      </div>
    </div>
  </mt-popup>
  <mt-popup v-model="isShowGameOver">
    <div class="answer-card">
      <div class="quick-send">
        <p v-for="u,index in gameOverData">
          第{{index+1}}名: {{u.name}} {{u.score}}分
        </p>
      </div>
    </div>
  </mt-popup>
</div>
</template>

<script>
import Draw from './draw'
import PlayerList from './playerList'
export default {
  components: { Draw, PlayerList },
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
        onAnswerRight (data) {
          const players = this.gameData.players
          if (players) {
            players.forEach(u => {
              u.score = data[u.uid]||u.score
            })
          }
        },
        onThisOver (data) {
          this.currentAnswer = data.gameData.answer.word
          this.isShowAnswerCard = true
        },
        onChangeGamer (data) {
          this.isShowAnswerCard = false
          this.typeName = ''
          this.gameData.imageData = ''
          this.$refs.draw.reset()
          this.getGameData()
        },
        onGameOver (data) {
          this.isShowAnswerCard = false
          this.isShowGameOver = true
          this.gameOverData = this.gameData.players.sort((u1, u2) => {
            return u1.score < u2.score
          })
          setTimeout(() => {
            this.$emit('game-over')
          },5000)
        }
      },
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
      return this.gameData.players||[]
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
      if(this.gameData.answer){
        if(this.isCurrentPlay){
          return "请画:" + this.gameData.answer.word
        }else{
          return "提示:" + this.gameData.answer.word.length + "个字  " + this.typeName
        }
      }
    }
  },
  methods: {
    userOffline (uid) {
      this.players.forEach(p => {
        if(p.uid == uid){
          p.isOffline = true
        }
      })
    },
    hideAnswerCart () {
      this.isShowAnswerCard = false
    },
    getGameData () {
      this.loading()
      this.$store.state.pomelo.request('connector.entryHandler.getGameData',(data) => {
        if(data.code == 500){
          this.$message(data.msg)
          return
        }
        console.log(data)
        this.gameData = data.gameData
        this.countTime = data.gameData.time
        this.loaded()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.game-begin{
  height: 100%;
}
header{
  height: 30px;
  line-height: 30px;
  position: absolute;
  width: 100%;
  top:0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  text-align: left;
  padding-left: 40px;
  background: rgba(255, 255, 255, 0.9);
  .tips{
    font-size:15px;
  }
  .time{
    position: absolute;
    left: 0;
    top: 0;
    color: #ec5500;
    font-size: 22px;
    width: 40px;
    text-align: center;
  }
}
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
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0,-50%);
  overflow: visible;
  height: 50px;
  width: 25px;
  z-index: 3;
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

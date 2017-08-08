<template>
<div class="chat-input">
  <div class="msg-list" v-if="showList">
    <p v-for="m in msgList" :class="{self:m.from.uid == userInfo.uid}">{{m.from.username}}说: {{m.msg}}</p>
  </div>
  <form @submit.prevent="sendMsg">
    <div class="input-group">
      <input type="text" placeholder="请输入要发送的消息" v-model="msg">
      <button class="mint-button mint-button--primary mint-button--normal" type="submit">发送</button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  props: ['showList'],
  data () {
    return {
      msg: '',
      msgList: [],
      userInfo: this.$store.state.userInfo,
      socketEvents: {
        onChat (data) {
          this.$emit('receive', data)
          this.msgList.push(data)
        }
      }
    }
  },
  methods: {
    send (msg) {
      this.$store.state.pomelo.request('room.roomHandler.sendMsg',
        {content:msg, target:'*'},
        data => {
          this.msg = ''
        })
    },
    sendMsg () {
      if (this.msg) {
        this.send(this.msg)
      }
    }
  },
  watch: {
   msgList() {
     this.$nextTick(() => {
       const container = this.$el.querySelector(".msg-list")
       container.scrollTop = container.scrollHeight
     })
   }
 }
}
</script>

<style lang="less">
@import "../../assets/less/base.less";
.input-group{
  @children-height: 40px;
  align-items: center;
  background: @white;
  border: @main-color solid 1px;
  input{
    border: 0;
    margin: 0;
    height: @children-height;
    padding: 0px 15px;
    width: 100%;
    font-size: 12px;
  }
  button{
    border-radius: 0;
    width: 100%;
    letter-spacing: 4px;
    font-size: 14px;
    height: @children-height;
  }
}
form{
  position: absolute;
  bottom:0;
  left: 0;
  width: 100%;
}
.chat-input{
  height: 100%;
  position: relative;
  padding-bottom: 80px;
  border-right: @main-color solid 1px;
}
.msg-list{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background: @white;
  padding-bottom: 30px;
  p{
    margin: 4px 4px;
    text-align: left;
    font-size: 14px;
    word-break: break-all;
    &.self{
      color:#eb6325;
    }
  }
}
</style>

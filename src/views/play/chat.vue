<template>
<div class="chat-input">
  <div class="msg-list" v-if="showList">
    <p v-for="m in msgList" :class="m.type">{{m.msg}}</p>
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
      socketEvents: {
        receiveMsg (data) {
          this.$emit('receive', data)
          this.msgList.unshift(data)
          this.msgList.splice(4, this.msgList.length) // 只显示最新的 4 条消息
        }
      }
    }
  },
  methods: {
    send (msg) {
      this.$store.state.pomelo.request('room.roomHandler.send',msg)
    },
    sendMsg () {
      if (this.msg) {
        this.send(this.msg)
        this.msg = ''
      }
    }
  }
}
</script>

<style lang="less">
@import "../../assets/less/base.less";
.input-group{
  @children-height: 40px;
  display: flex;
  align-items: center;
  background: @white;
  border: @main-color solid 1px;
  input{
    flex: 1;
    border: 0;
    margin: 0;
    height: @children-height;
    padding: 0px 15px;
    font-size: 14px;
  }
  button{
    border-radius: 0;
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
  padding-bottom: 40px;
  border-right: @main-color solid 1px;
}
.msg-list{
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  background: @white;
  p{
    margin: .6em .8em;
  }
}
</style>

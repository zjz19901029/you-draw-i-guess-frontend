<template>
<div>
  <mt-header title="创建房间">
    <mt-button slot="left" icon="back" @click="$router.back()">返回</mt-button>
    <mt-button slot="right" @click="createRoom">完成</mt-button>
  </mt-header>
  <form @submit.prevent="createRoom">
    <mt-field label="房间名称" placeholder="请输入房间名" v-model="room.name"></mt-field>
    <mt-radio title="房间类型" v-model="room.type" :options="options"></mt-radio>
  </form>
</div>
</template>

<script>
export default {
  computed: {
    options () {
      const roomType = this.$const('RoomType')
      return Object.keys(roomType).map(k => {
        return {
          label: roomType[k],
          value: k
        }
      })
    }
  },
  data () {
    return {
      room: {
        name: this.$store.getters.user.username + '的房间',
        playNumber: 8,
        type: '1',
        playTimes: 3
      },
      socketEvents: {
        'createRoom': this.createSuccess
      }
    }
  },
  methods: {
    createSuccess (room) {
      this.loaded()
      this.$router.replace({ name: 'room', params: {id: room.id} })
    },
    createRoom () {
      if (this.room.name) {
        this.loading('正在创建房间')
        this.$webSocket.send(this.room, 'createRoom')
      } else {
        this.$message('请输入房间名称')
      }
    }
  }
}
</script>

<style lang="css">
</style>

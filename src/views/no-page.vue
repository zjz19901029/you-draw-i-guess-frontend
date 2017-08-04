<template>
  <div class="no-page">没有找到改页面 {{message}}
    <div class="back">
      <a href="javascript:;" @click="back">返回</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  },
  beforeRouteEnter (t, f, next) {
    next(vm => {
      vm.message = t.params.message
    })
  }
}
</script>
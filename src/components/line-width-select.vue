<template>
<div class="lines-wrap">
  <div class="lines-list" v-for="l in lines" @click="selectLine(l)">
    <div class="line-width" :style="{height: l + 'px'}"></div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      lines: [2, 4, 6, 8, 10, 12, 16, 20]
    }
  },
  methods: {
    selectLine (line) {
      this.$emit('select-line', line)
    }
  }
}
</script>

<style lang="less">
.lines-wrap{
  position: absolute;
  top:30px;
  right: 0;
  width: 210px;
  padding-bottom: 0;
  background: #fff;
  box-shadow: 0 0 4px 1px #ccc; 
}
.lines-list{
  float: left;
  width: 40px;
  height: 40px;
  padding: 10px;
  .line-width{
    background: #000;
    border:1px solid #eee;
  }
}
</style>

<template>
<div class="color-select">
  <div v-for="c, index in colors">
    <span class='color-item' :style="{background: c, border: getBorder(c)}" :class="{selected: index === currentColor}" @click="selectColor(index)"></span>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      currentColor: 12,
      colors: [
        '#F44336', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50',
        '#FFEB3B', '#FF9800', '#795548', '#607D8B',
        '#000', '#BBB', '#FFF'
      ]
    }
  },
  methods: {
    getBorder (color) {
      if (color === '#FFF') return '1px solid #ccc'
      return ''
    },
    selectColor (index) {
      this.currentColor = index
      this.$emit('select-color', this.colors[index])
    }
  }
}
</script>

<style lang="less">
.color-select{
  position: absolute;
  top:30px;
  right: 0;
  width: 210px;
  padding-bottom: 0;
  background: #fff;
  box-shadow: 0 0 4px 1px #ccc; 
  &>div{
    float: left;
    width: 40px;
    height: 40px;
    padding: 10px;
  }
  .color-item{
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
    &.selected{

    }
  }
}
</style>

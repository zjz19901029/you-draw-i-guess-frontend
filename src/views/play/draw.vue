<template>
<div class="draw-wrapper">
  <div class="draw-wrap">
    <canvas @touchstart="start" @touchmove.prevent="move" @touchend="end" v-if="canDraw" ref="canvasDom">
    </canvas>
    <canvas v-else ref="canvasDom"></canvas>
    <slot name="ondraw"></slot>
  </div>
  <div class="operator-btns" v-if="canDraw">
    <div>
      <div class="color" :style="{background: setting.color,border: getBorder(setting.color)}" @click="toggleSelectColor"></div>
      <color-select @select-color = "selectColor" v-show="selectColorShow"></color-select>
    </div>
    <div>
      <div class="line" :style="{height: setting.line + 'px', background: setting.color,border: getBorder(setting.color)}" @click="toggleSelectLine"></div>
      <line-select @select-line = "selectLine" v-show="selectLineShow" ></line-select>
    </div>
    <div>
      <div class="clear" @click="clear">clear</div>
    </div>
  </div>
</div>
</template>

<script>
import colorSelect from '@/components/color-select'
import lineSelect from '@/components/line-width-select'
export default {
  components: { colorSelect, lineSelect },
  props: ['canDraw', 'imageData'],
  data () {
    return {
      socketEvents: {
        onDrawAction (data) {
          if (!this.canDraw) {
            this.setting = data.setting
            this.doAction(data.actionName, data.data, false)
          }
        },
        onDrawImage (data) {
          if (!this.canDraw) {
            this.drawImage(data)
          }
        }
      },
      lineWidth: 5,
      offsetTop: 0,
      offsetLeft: 0,
      canvasHeight: 0,
      canvasWidth: 0,
      lineCap: 'round',
      historyData: [],
      historyIndex: -1,
      selectColorShow: false,
      selectLineShow: false,
      setting: { color: '#000', line: 4 },
      receiveMsg: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      let dom = this.$refs.canvasDom
      let wrap = dom.parentElement
      this.canvasHeight = wrap.clientHeight
      this.canvasWidth = wrap.clientWidth
      dom.setAttribute('width', wrap.clientWidth)
      dom.setAttribute('height', wrap.clientHeight)
      let cxt = dom.getContext('2d')
      cxt.lineCap = this.lineCap
      cxt.lineJoin = this.lineCap
      cxt.lineWidth = this.setting.line
      this.canvas = dom
      this.cxt = cxt
      this.countOffset(dom)
      this.saveData()
      /*this.$watch('imageData', v => {
        this.$nextTick(_ => {
          console.log(111111,v)
          if (v) {
            this.drawImage(v)
          } else {
            this.clearCanvas()
          }
        })
      })*/
    })
  },
  watch: {

    setting: {
      handler (val) {
        this.cxt.lineWidth = val.line
        this.cxt.strokeStyle = val.color
      },
      deep: true
    },
    historyIndex () {
      let data = this.historyData[this.historyIndex]
      if (data) {
        this.drawImage({dataUrl: data})
        this.sendImage(data)
      }
    }
  },
  computed: {
    canUndo () {
      return this.historyIndex > 0
    },
    canRedo () {
      return this.historyIndex < this.historyData.length - 1
    }
  },
  methods: {
    drawImage (data) {
      var img = new window.Image()
      img.onload = () => {
        this.clearCanvas()
        this.cxt.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight)
      }
      img.src = data.dataUrl
    },
    countOffset (dom) {
      if (dom) {
        this.offsetTop = this.offsetTop + dom.offsetTop
        this.offsetLeft = this.offsetLeft + dom.offsetLeft
        this.countOffset(dom.offsetParent)
      }
    },
    toggleSelectLine () {
      this.selectLineShow = !this.selectLineShow
      this.selectColorShow = false
    },
    toggleSelectColor () {
      this.selectColorShow = !this.selectColorShow
      this.selectLineShow = false
    },
    selectLine (line) {
      this.setting.line = line
      this.selectLineShow = false
    },
    selectColor (color) {
      this.setting.color = color
      this.selectColorShow = false
    },
    getBorder (color) {
      if (color === '#FFF') return '1px solid #ccc'
      return ''
    },
    draw ({ x, y, width, height }, type = 'start') {
      let cxt = this.cxt
      if(!this.canDraw){//需要按比例对坐标进行转换
        x = this.canvasWidth/width*x
        y = this.canvasHeight/height*y
      }
      switch (type) {
        case 'start':
          cxt.beginPath()
          cxt.fill()
          let lw = this.lineWidth
          cxt.moveTo(x - lw / 16, y - lw / 16)
          cxt.lineTo(x, y)
          break
        case 'move':
          cxt.lineTo(x, y)
          break
      }
      cxt.stroke()
    },
    doAction (actionName, data, sync = true) {
      switch (actionName) {
        case 'start':
        case 'move':
          this.draw(data, actionName)
          if (sync) this.sendAction({ actionName, data, setting: this.setting })
          break
        case 'end':
          this.cxt.closePath()
          sync && this.saveData()
          break
        case 'clear':
          this.clearCanvas()
          sync && this.saveData()
          break
        case 'undo':
          this.undo()
          break
        case 'redo':
          this.redo()
          break
        default:
          console.log('unknow actionName:', actionName)
      }

      if (sync && actionName !== 'move' && actionName !== 'start') {
      }
    },
    sendImage (data) {
      this.canDraw && this.$store.state.pomelo.notify('room.roomHandler.drawImage',{
        dataUrl: data
      })
    },
    sendAction (action) {
      this.canDraw && this.$store.state.pomelo.notify('room.roomHandler.drawAction',action)
    },
    clearCanvas () {
      this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },
    saveData () {
      this.historyData.splice(this.historyIndex + 1, this.historyData.length)
      this.historyData.push(this.canvas.toDataURL())
      this.historyIndex = this.historyData.length - 1
    },
    undo () {
      this.canUndo && this.historyIndex --
    },
    redo () {
      this.canRedo && this.historyIndex ++
    },
    getPoint (e) {
      let touch = e.touches[0]
      let x = touch.clientX - this.offsetLeft
      let y = touch.clientY - this.offsetTop
      let width = this.canvasWidth
      let height = this.canvasHeight
      return { x, y, width, height }
    },
    start (e) {
      this.doAction('start', this.getPoint(e))
    },
    move (e) {
      this.doAction('move', this.getPoint(e))
    },
    end () {
      this.doAction('end')
    },
    clear () {
      this.doAction('clear')
    }
  }
}
</script>

<style lang="less">
/*@import "@/assets/css/iconfont/iconfont.css";*/
@operator-color: #eee;
.operator-btns{
  height: 30px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  &>div{
    height: 100%;
    position: relative;
    float: right;
    width: 50px;
    display: flex;
    >div{
      margin:auto;
    }
  }
  .color{
    border-radius: 50%;
    height: 20px;
    width: 20px;
  }
  .line{
    width: 5vw;
    margin-right: 1vw;
    text-align: center;
  }
  .iconfont{
    font-size: 20px;
  }
}
.draw-wrapper{
  height: 100%;
}
.draw-wrap{
  background: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  .operator-wrap{
    box-shadow: 0 0 5vw #ccc;
    position: absolute;
    width: 100%;
    bottom:0;
    background: #fff;
  }
  &>canvas{
    display: block;
  }
}
</style>

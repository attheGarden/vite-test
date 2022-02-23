<template>
  <div class="text">
    恭喜你获得了 60 原石!
  </div>
  <canvas id="cardCover" width="400" height="150"></canvas>
</template>

<script>
import {onMounted} from "vue";

export default {
  name: 'card',
  setup() {
    onMounted(() => {
      const canvas = document.getElementById('cardCover')
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'darkgray'
      ctx.fillRect(0, 0, 400, 100)
      ctx.fillStyle = '#fff'
      ctx.font = '24px STheiti, SimHei'
      ctx.fillText('原神刮刮乐', 140, 50)

      let drawFlag = false
      canvas.onmousedown = () => {
        drawFlag = true
      }

      canvas.onmousemove = (e) => {
        if (!drawFlag) return
        const x = e.pageX - canvas.offsetLeft
        const y = e.pageY - canvas.offsetTop
        ctx.globalCompositeOperation = 'destination-out'
        ctx.arc(x,y,10,0,2*Math.PI)
        ctx.fill()
      }

      canvas.onmouseup = () => {
        drawFlag = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
.text {
  position: absolute;
  left: 130px;
  top: 35px;
  z-index: -1;
}
</style>

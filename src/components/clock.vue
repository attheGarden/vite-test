<template>
  <div class="clock">
    <canvas id="clock" width="600" height="600"></canvas>
  </div>
</template>

<script>
import {onMounted} from "vue";

export default {
  props: {},
  setup() {
    onMounted(() => {
      let canvas = document.getElementById('clock');
      let ctx = canvas.getContext('2d');
      const clock = () => {
        ctx.save()
        ctx.clearRect(0, 0, 600, 600)
        ctx.translate(300, 300);
        ctx.save()

        ctx.beginPath()
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        const time = new Date();
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();

        // 时针
        ctx.rotate(2 * Math.PI / 12 * hour + 2 * Math.PI / 12 * (min / 60) - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 分针
        ctx.rotate(2 * Math.PI / 60 * min + 2 * Math.PI / 60 * (sec / 60) - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(60, 0);
        ctx.lineWidth=5;
        ctx.strokeStyle = 'blue'
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 秒针
        ctx.rotate(2 * Math.PI / 60 * sec - Math.PI / 2)
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(80, 0);
        ctx.lineWidth=2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 刻度
        ctx.lineWidth=1;
        for (let i = 0; i < 60; i++) {
          ctx.rotate(2 * Math.PI / 60)
          ctx.beginPath()
          ctx.moveTo(90, 0)
          ctx.lineTo(100, 0)
          // ctx.strokeStyle = 'red'
          ctx.stroke()
          ctx.closePath()
        }
        ctx.restore()
        ctx.save()
        ctx.lineWidth = 5
        for (let i = 0; i < 12; i++) {
          ctx.rotate(2 * Math.PI / 12)
          ctx.beginPath()
          ctx.moveTo(85, 0)
          ctx.lineTo(100, 0)
          ctx.stroke()
          ctx.closePath()
        }
        ctx.restore()
        ctx.restore()
        requestAnimationFrame(clock)
      }
      requestAnimationFrame(clock)
    })
  }
}
</script>

<style lang="less" scoped>
.clock {
}
</style>

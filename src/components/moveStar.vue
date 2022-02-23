<template>
  <div>
    <canvas id="moveStar"></canvas>
  </div>
</template>

<script>
  import {onMounted} from "vue";

  export default {
    name: 'moveStar',
    setup() {
      onMounted(() => {
        const canvas = document.getElementById('moveStar');
        const ctx = canvas.getContext('2d')

        canvas.width = document.documentElement.clientWidth || document.body.clientWidth
        canvas.height = document.documentElement.clientHeight || document.body.clientHeight

        window.onresize = () => {
          canvas.width = document.documentElement.clientWidth || document.body.clientWidth
          canvas.height = document.documentElement.clientHeight || document.body.clientHeight
        }

        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'white'

        class StarTemp {
          constructor(x,y,r) {
            this.x = x
            this.y = y
            this.r = r

            this.speedX = (Math.random()*2)* Math.pow(-1, Math.round(Math.random()))
            this.speedY = (Math.random())* Math.pow(-1, Math.round(Math.random()))
          }
          draw () {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
          }

          move () {
            this.x -= this.speedX
            this.y -= this.speedY

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
          }
        }

        const linkStar = (startX, startY, endX, endY) => {
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          ctx.closePath()
        }

        // const star = new StarTemp(Math.random() * canvas.width, Math.random() * canvas.height, 3)
        // setInterval(() => {
        //   ctx.clearRect(0, 0, canvas.width, canvas.height)
        //   star.move()
        //   star.draw()
        // }, 50)
        const stars = []
        // 跟随鼠标star
        const mouseStar = new StarTemp(0, 0, 3)
        canvas.onmousemove = (e) => {
          mouseStar.x = e.clientX
          mouseStar.y = e.clientY
        }
        window.onclick = function (e) {
          for (let i = 0; i < 5; i++) {
            stars.push(new StarTemp(e.clientX, e.clientY, 3))
          }
        }
        for (let i = 0; i < 100; i++) {
          // 随机在canvas范围内找一个坐标画星星
          stars.push(new StarTemp(Math.random() * canvas.width, Math.random() * canvas.height, 3))
        }
        const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // 遍历移动渲染
          stars.forEach(star => {
            star.move()
            star.draw()
          })

          stars.forEach((star, index) => {
            for (let i = index + 1; i < stars.length; i++) {
              if (Math.abs(star.x - stars[i].x) < 50 && Math.abs(star.y - stars[i].y) < 50) {
                linkStar(star.x, star.y, stars[i].x, stars[i].y)
              }
            }

            if (Math.abs(mouseStar.x - star.x) < 50 && Math.abs(mouseStar.y - star.y) < 50) {
              linkStar(mouseStar.x, mouseStar.y, star.x, star.y)
            }
          })
          requestAnimationFrame(draw)
        }
        requestAnimationFrame(draw)
      })
    }
  }
</script>

<style lang="less" scoped>
canvas {
  background-color: #000000;
}
</style>

<template>
  <div>
    <img src="/image/gouzhou.jpg" height="55" width="45" id="imgTemp" style="visibility: hidden"/>
    <canvas id="snake" width="800" height="800"></canvas>
  </div>
</template>

<script>
import {onMounted} from "vue";

export default {
  name: "snake",
  setup() {
    onMounted(() => {
      const canvas = document.getElementById('snake');
      const ctx = canvas.getContext('2d');
      let img = document.getElementById('imgTemp')
      img.onload = () => {
        const rect = function (x, y, width, height, color) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.color = color;
        }

        const headSpecial = function (x, y, width, height) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        }

        headSpecial.prototype.draw = function () {
          ctx.drawImage(img,this.x,this.y, 20, 20)
        }

        rect.prototype.draw = function () {
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        const snake = function (length = 0) {
          this.length = length;
          this.head = new headSpecial(canvas.width / 2, canvas.height / 2, 20, 20);
          this.body = [];

          let x = this.head.x - 20;
          let y = this.head.y;
          for (let i = 0; i < this.length; i++) {
            const rectTemp = new rect(x, y, 20, 20, 'yellow')
            this.body.push(rectTemp)
            x -= 20
          }
        }

        snake.prototype.drawSnake = function () {
          if (isHit(this)) {
            clearInterval(timer)
            const confirmTemp = confirm('remake?')
            if (confirmTemp) {
              this.head.x = canvas.width / 2
              this.head.y = canvas.height / 2
              timer = setInterval(() => {
                animate()
              }, 100)
            }
            return
          }
          console.log(this.head)
          this.head.draw()
          for (let i = 0; i < this.body.length; i++) {
            this.body[i].draw()
          }
        }

        snake.prototype.moveSnake = function () {
          const rectTemp = new rect(this.head.x, this.head.y, this.head.width, this.head.height, 'yellow')
          this.body.unshift(rectTemp)

          this.body.pop()

          switch (this.direction) {
            case 0:
              this.head.x -= this.head.width
              break
            case 1:
              this.head.y -= this.head.height
              break
            case 2:
              this.head.x += this.head.width
              break
            case 3:
              this.head.y += this.head.height
              break
          }
        }

        document.onkeydown = function (e) {
          // 键盘事件
          e = e || window.event
          // 左37  上38  右39  下40
          switch (e.keyCode) {
            case 37:
              console.log(37)
              // 三元表达式，防止右移动时按左，下面同理(贪吃蛇可不能直接掉头)
              snakeTemp.direction = snakeTemp.direction === 2 ? 2 : 0
              snakeTemp.moveSnake()
              break
            case 38:
              console.log(38)
              snakeTemp.direction = snakeTemp.direction === 3 ? 3 : 1
              break
            case 39:
              console.log(39)
              snakeTemp.direction = snakeTemp.direction === 0 ? 0 : 2
              break
            case 40:
              console.log(40)
              snakeTemp.direction = snakeTemp.direction === 1 ? 1 : 3
              break

          }
        }

        const snakeTemp = new snake(3)
        snakeTemp.direction = 2

        snakeTemp.drawSnake()


        function animate() {
          // 先清空
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // 移动
          snakeTemp.moveSnake()
          // 再画
          snakeTemp.drawSnake()
        }

        function isHit(snake) {
          const head = snake.head
          const xLimit = head.x < 0 || head.x >= canvas.width
          const yLimit = head.y < 0 || head.y >= canvas.height
          const hitSelf = snake.body.find(({ x, y }) => head.x === x && head.y === y)
          return xLimit || yLimit || hitSelf
        }

        let timer = setInterval(() => {
          animate()
        }, 100)
      }



    })
  }
}
</script>
<style lang="less" scoped>
canvas {
  border: 1px solid #000000;
}
</style>

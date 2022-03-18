<template>
  <div class="canvas-wrapper">
    <div class="menu">
      <ul>
        <li @click="drawTriangle">三角形</li>
        <li @click="drawSmileFace">笑脸</li>
        <li @click="drawCircle">圆</li>
        <li @click="drawDialog">会话框</li>
        <li @click="drawPic">吃豆人</li>
      </ul>
    </div>
    <canvas id="canvas" width="500" height="400"></canvas>
  </div>
</template>

<script>

export default {
  name: 'simpleTest',
  setup() {
    const drawTriangle = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.moveTo(25, 25)
      ctx.lineTo(100, 25)
      ctx.lineTo(25, 105)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(125, 125);
      ctx.lineTo(125, 45);
      ctx.lineTo(45, 125);
      ctx.closePath()
      ctx.stroke()
    }

    const drawSmileFace = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
      ctx.moveTo(110, 75);
      ctx.arc(75, 75, 35, 0, Math.PI, false);   // 口(顺时针)
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // 左眼
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // 右眼
      ctx.stroke();
    }

    const drawCircle = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i= 0; i<4; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.beginPath()
          const x = 25 + j * 50; // x 坐标值
          const y = 25 + i * 50; // y 坐标值
          const radius = 20; // 圆弧半径
          const startAngle = 0; // 开始点
          const endAngle = Math.PI + (Math.PI * j) / 2; // 结束点
          const anticlockwise = i % 2 !== 0; // 顺时针或逆时针

          ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

          if (i>1){
            ctx.fill();
          } else {
            ctx.stroke();
          }
        }
      }
    }

    const drawDialog = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 二次贝塞尔曲线
      ctx.beginPath();
      ctx.moveTo(75, 25);
      ctx.quadraticCurveTo(25, 25, 25, 62.5);
      ctx.quadraticCurveTo(25, 100, 50, 100);
      ctx.quadraticCurveTo(50, 120, 30, 125);
      ctx.quadraticCurveTo(60, 120, 65, 100);
      ctx.quadraticCurveTo(125, 105, 125, 62.5);
      ctx.quadraticCurveTo(125, 25, 75, 25);
      ctx.stroke();
    }

    const roundedRect = (ctx, x, y, width, height, radius) =>{
      ctx.beginPath()
      ctx.moveTo(x, y + radius)
      ctx.lineTo(x, y + height - radius)
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
      ctx.lineTo(x + width - radius, y + height)
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
      ctx.lineTo(x + width, y + radius)
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
      ctx.lineTo(x + radius, y)
      ctx.quadraticCurveTo(x, y, x, y + radius)
      ctx.stroke()
    }
    const drawPic = () => {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      roundedRect(ctx, 12, 12, 164, 164, 15);
      roundedRect(ctx, 19, 19, 150, 150, 9);
      roundedRect(ctx, 53, 53, 49, 33, 10);
      roundedRect(ctx, 53, 119, 49, 16, 6);
      roundedRect(ctx, 135, 53, 25, 33, 10);
      roundedRect(ctx, 135, 119, 25, 49, 10);

      ctx.beginPath();
      ctx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
      ctx.lineTo(31, 37);
      ctx.fill();

      for(let i = 0; i < 8; i++){
        ctx.fillRect(51 + i * 16, 35, 4, 4);
      }

      for(let i = 0; i < 6; i++){
        ctx.fillRect(115, 51 + i * 16, 4, 4);
      }

      for(let i = 0; i < 8; i++){
        ctx.fillRect(51 + i * 16, 99, 4, 4);
      }

      ctx.beginPath();
      ctx.moveTo(83, 116);
      ctx.lineTo(83, 102);
      ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
      ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
      ctx.lineTo(111, 116);
      ctx.lineTo(106.333, 111.333);
      ctx.lineTo(101.666, 116);
      ctx.lineTo(97, 111.333);
      ctx.lineTo(92.333, 116);
      ctx.lineTo(87.666, 111.333);
      ctx.lineTo(83, 116);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(91, 96);
      ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
      ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
      ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
      ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
      ctx.moveTo(103, 96);
      ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
      ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
      ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
      ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
      ctx.fill();
    }

    return {drawTriangle, drawSmileFace, drawCircle, drawDialog, drawPic}
  }
}
</script>


<style lang="less">
.canvas-wrapper {
  .menu {
    width: 500px;
    height: 70px;

    ul {
      display: flex;
      align-items: center;
      justify-content: center;

      li {
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
    }
  }

  .box-wrapper {
    width: 200px;
    height: 100px;
    display: flex;

    .box1 {
      width: 100px;
      height: 100px;
      background-color: red;
      border-top-right-radius: 40px;
    }

    .box2 {
      width: 100px;
      height: 100px;
      border-bottom-left-radius: 40px;
      border-top-left-radius: 50px;
      background-color: aqua;
      z-index: 3;
    }

    .box3 {
      position: relative;
      width: 50px;
      height: 50px;
      background-color: red;
      right: 80px;
      top: 50px;
    }

  }
}
</style>

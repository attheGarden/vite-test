<template>
  <div>
    <canvas id="webgl" width="400" height="400" @click="clickPoint"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../utils/wegblUtils";

export default {
  name: "webGLTest",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // point1(gl);
      // point2(gl);
    })
    const point1 = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        void main() {
          gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
          gl_PointSize = 20.0;
        }
      `
      // 片元着色器
      const FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
      }`

      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      gl.drawArrays(gl.POINTS, 0, 1);
    }

    const point2 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = a_PointSize;
        }
      `
      const FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
      }`
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
      gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);
      gl.vertexAttrib1f(a_PointSize, 10.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }

    const g_points = []; // 鼠标点击位置数组
    const g_colors = []; // 存储点的颜色

    const clickPoint = event => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = 10.0;
        }
      `

      // 片元着色器
      const FSHADER_SOURCE = `
        precision mediump float;
        uniform vec4 u_FragColor;
        void main() {
          gl_FragColor = u_FragColor;
        }
      `

      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      // console.log(gl.program)
      const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

      let x = event.clientX;
      let y = event.clientY;
      const rect = event.target.getBoundingClientRect();
      x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
      y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
      g_points.push([x, y]);

      if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 1.0, 0.0, 1.0]);
      } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
      } else {
        g_colors.push([0.0, 0.0, 1.0, 0.0]);
      }

      for (let i = 0; i < g_points.length; i += 1) {
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);

        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);

        gl.drawArrays(gl.POINTS, 0, 1);
      }
    }

    return {
      clickPoint
    }
  }
}
</script>

<style scoped>

</style>

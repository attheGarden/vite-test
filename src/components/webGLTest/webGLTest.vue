<template>
  <div>
    <canvas id="webgl" width="400" height="400" @click="clickPoint"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../utils/wegblUtils";

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
      // multiPoints(gl);
      // triangle1(gl);
      // rect1(gl);
      translatedTriangle(gl)
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

    const initVertexBuffers = (gl, vertices, n) => {

      const vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the Buffer object');
        return -1;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

      // 分配缓冲区对象
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

      // 开启变量, 使顶点着色器可以访问缓冲区兑现
      gl.enableVertexAttribArray(a_Position);

      return n;
    }

    const multiPoints = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = 10.0;
        }
      `

      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
      ])
      const n = initVertexBuffers(gl, vertices, 3);
      gl.drawArrays(gl.POINTS, 2, n);
    }

    const triangle1 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        void main() {
          gl_Position = a_Position;
        }
      `

      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

      const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
      ])
      const n = initVertexBuffers(gl, vertices, 3);
      gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    const rect1 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        void main() {
          gl_Position = a_Position;
        }
      `

      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
      ])
      const n = initVertexBuffers(gl, vertices, 4);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }

    const translatedTriangle = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform vec4 u_Translation;
        void main() {
          gl_Position = a_Position + u_Translation;
        }
      `

      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `

      const tx = 0.5, ty = 0.5, tz = 0.2;
      // 初始化着色器
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

      const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
      ])
      // 设置点的位置
      const n = initVertexBuffers(gl, vertices, 3);

      const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
      gl.uniform4f(u_Translation, tx, ty, tz, 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, n)
    }

    return {
      clickPoint
    }
  }
}
</script>

<style scoped>

</style>

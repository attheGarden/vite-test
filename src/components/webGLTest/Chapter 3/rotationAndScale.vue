<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../../utils/wegblUtils";

export default {
  name: "rotationAndScale",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // rotateTriangle(gl);
      // rotateTriangleMatrix(gl);
      scaleTriangleMatrix(gl)
    })

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


    const rotateTriangle = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform float u_CosB, u_SinB;
        void main() {
          gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
          gl_Position.y = a_Position.x * u_SinB - a_Position.y * u_CosB;
          gl_Position.z = gl_Position.z;
          gl_Position.w = 1.0;
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

      const angle = 60.0;

      const radian = Math.PI * angle / 180.0; // 转为弧度
      const cosB = Math.cos(radian);
      const sinB = Math.sin(radian);

      const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
      const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

      gl.uniform1f(u_CosB, cosB);
      gl.uniform1f(u_SinB, sinB);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    const rotateTriangleMatrix = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform mat4 u_xformMatrix;
        void main() {
          gl_Position = u_xformMatrix * a_Position;
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

      const angle = 90.0;

      const radian = Math.PI * angle / 180.0; // 转为弧度
      const cosB = Math.cos(radian);
      const sinB = Math.sin(radian);

      const xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
      ])

      const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
      gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    const scaleTriangleMatrix = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform mat4 u_xformMatrix;
        void main() {
          gl_Position = u_xformMatrix * a_Position;
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

      const sx = 1.0, sy = 1.5, sz = 1.0;
      const xformMatrix = new Float32Array([
          sx, 0.0, 0.0, 0.0,
          0.0, sy, 0.0, 0.0,
          0.0, 0.0, sz, 0.0,
          0.0, 0.0, 0.0, 1.0
      ])
      const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
      gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }
  }
}
</script>

<style scoped>

</style>

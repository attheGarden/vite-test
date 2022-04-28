<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../../utils/wegblUtils";
import {Matrix4} from "../../../utils/cuon-matrix";

export default {
  name: "modelTransform",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      // test1(gl);
      test2(gl);
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

    // 平移 + 旋转
    const test1 = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform mat4 u_ModelMatrix;
        void main() {
          gl_Position = u_ModelMatrix * a_Position;
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
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
      ])
      const n = initVertexBuffers(gl, vertices, 3);

      const angle = 90.0;
      const tx = 0.5;
      const modelMatrix = new Matrix4();

      modelMatrix.setRotate(angle, 0, 0, 1);
      modelMatrix.translate(tx, 0, 0);

      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    // 以动画形式 平移 + 旋转
    const test2 = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform mat4 u_ModelMatrix;
        void main() {
          gl_Position = u_ModelMatrix * a_Position;
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
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
      ])
      const n = initVertexBuffers(gl, vertices, 3);

      const angle_step = 45.0;
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      let current_angle = 0.0
      const modelMatrix = new Matrix4();

      let g_last = Date.now();
      const animate = angle => {
        const now = Date.now();
        const elapsed = now - g_last;
        g_last = now;
        let new_angle = angle + angle_step * elapsed / 1000.0;

        return new_angle %= 360;
        // return angle + 10
      }

      const draw = (gl, n, current_angle, modelMatrix, u_ModelMatrix) => {
        modelMatrix.setRotate(current_angle, 0, 0, 1);
        modelMatrix.translate(0.35, 0, 0)
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, n);
      }

      const trick = () => {
        current_angle = animate(current_angle)
        draw(gl, n, current_angle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(trick);
      }
      trick();
    }
  }
}
</script>

<style scoped>

</style>

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
  name: "test1",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // test1(gl);
      // test2(gl);
      // multiAttributeSize(gl);
      multiAttributeSize_change(gl)
    })

    const initVertexBuffers = gl => {
      const vertexBuffer = gl.createBuffer();
      const sizeBuffer = gl.createBuffer();

      const n = 3;
      const vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
      ])

      const sizes = new Float32Array([
          10.0, 20.0, 30.0
      ])

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
      const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

      gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0 ,0);
      gl.enableVertexAttribArray(a_PointSize);

      return n;
    }

    const multiAttributeSize = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = a_PointSize;
        }
      `
      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const n = initVertexBuffers(gl);

      gl.drawArrays(gl.POINTS, 0, n);
    }

    const initVertexBuffers_change = gl => {
      const verticesSizes = new Float32Array([
          0.0, 0.3, 10.0,
          -0.3, -0.3, 20.0,
          0.3, -0.3, 30.0
      ])
      const n = 3;
      const vertexSizeBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

      const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

      const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0)
      gl.enableVertexAttribArray(a_Position);

      const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
      gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
      gl.enableVertexAttribArray(a_PointSize);

      return n;
    }

    const multiAttributeSize_change = gl => {
      // 顶点着色器
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = a_PointSize;
        }
      `
      // 片元着色器
      const FSHADER_SOURCE = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const n = initVertexBuffers_change(gl);

      gl.drawArrays(gl.POINTS, 0, n);
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../../utils/wegblUtils";

export default {
  name: "multiAttributeColor",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      test2(gl)
    })

    const initVertexBuffers = gl => {
      const verticesColor = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
      ])
      const n = 3;

      const vertexColorBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW)

      const FSIZE = verticesColor.BYTES_PER_ELEMENT;
      const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
      gl.enableVertexAttribArray(a_Position)

      // 获取a_Color的存储位置, 分配缓冲区, 并开启缓冲区
      const a_Color = gl.getAttribLocation(gl.program, 'a_Color')

      gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
      gl.enableVertexAttribArray(a_Color)

      return n
    }

    const test = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        void main() {
          gl_Position = a_Position;
          gl_PointSize = 10.0;
          v_Color = a_Color;
        }
      `
      const FSHADER_SOURCE = `
        precision mediump float;
        varying vec4 v_Color;
        void main() {
          gl_FragColor = v_Color;
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const n = initVertexBuffers(gl);

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, n);

    }

    const initVertexBuffers2 = gl => {
      const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
      ])
      const n = 3

      const vertexBuffer = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

      const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false,0, 0);

      const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
      const u_Height = gl.getUniformLocation(gl.program, 'u_Height')

      gl.uniform1f(u_Width, gl.drawingBufferWidth)
      gl.uniform1f(u_Height, gl.drawingBufferHeight)

      gl.enableVertexAttribArray(a_Position)

      gl.bindBuffer(gl.ARRAY_BUFFER, null)

      return n
    }

    const test2 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        void main() {
          gl_Position = a_Position;
        }
      `
      const FSHADER_SOURCE = `
        precision mediump float;
        uniform float u_Width;
        uniform float u_Height;
        void main() {
          gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);
        }
      `
      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      const n = initVertexBuffers2(gl)

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, n);
    }
  }
}
</script>

<style scoped>

</style>

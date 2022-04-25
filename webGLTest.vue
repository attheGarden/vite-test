<template>
  <div>
    <canvas id="webgl" width="400" height="400" />
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../utils/wegblUtils";

export default {
  name: "webGLTest",
  setup() {
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      const gl = canvas.getContext('experimental-webgl')
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      point1(gl);
    })
    const point1 = (gl) => {
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
  }
}
</script>

<style scoped>

</style>

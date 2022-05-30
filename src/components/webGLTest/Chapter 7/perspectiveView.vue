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
  name: "perspectiveView",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(255.0, 0, 255.0, 1.0)
      test1(gl, canvas);
      // test2(gl);

    })

    const test1 = (gl, canvas) => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_ProjMatrix;
        varying vec4 v_Color;
        void main () {
          gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
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

      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
      const initVertexBuffers = gl => {
        const verticesColors = new Float32Array([
          // Three triangles on the right side
          0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
          0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
          1.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

          0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
          0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
          1.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

          0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
          0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
          1.25, -1.0,   0.0,  1.0,  0.4,  0.4,

          // Three triangles on the left side
          -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
          -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
          -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

          -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
          -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
          -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

          -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
          -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
          -0.25, -1.0,   0.0,  1.0,  0.4,  0.4,
        ]);

        const n = 18;
        const vertexColorBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

        const FSIZE = verticesColors.BYTES_PER_ELEMENT;
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
        gl.enableVertexAttribArray(a_Position);

        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
        gl.enableVertexAttribArray(a_Color);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);


        return n;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0, 0, 0, 1);

      const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
      const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

      const viewMatrix = new Matrix4();
      const projMatrix = new Matrix4();

      viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
      projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100)

      gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
      gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, n);
    }
  }
}
</script>

<style scoped>

</style>

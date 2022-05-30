<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {Matrix4} from "../../../utils/cuon-matrix";
import {initShaders} from "../../../utils/wegblUtils";

export default {
  name: "lookAtTriangles",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(255.0, 0, 255.0, 1.0)
      // test1(gl);
      // test2(gl);
      test4(gl);
    })

    const test1 = gl => {
      const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_ViewMatrix;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_ViewMatrix * a_Position;
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
          0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
          -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
          0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

          0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
          -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
          0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

          0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
          -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
          0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        ])

        const n = 9;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return n;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0, 0, 0, 1);

      const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
      const viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

      // 将视图矩阵传递给u_ViewMatrix变量
      gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, n);

    }

    const test2 = gl => {
      const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_ViewMatrix;
      uniform mat4 u_ModelMatrix;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
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
          0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
          -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
          0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

          0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
          -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
          0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

          0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
          -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
          0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        ])

        const n = 9;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return n;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0, 0, 0, 1);

      const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      const viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

      const modelMatrix = new Matrix4();
      modelMatrix.setRotate(-90, 0, 0, 1);

      gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }


    const test3 = gl => {
      const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_ModelViewMatrix;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_ModelViewMatrix * a_Position;
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
          0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
          -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
          0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

          0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
          -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
          0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

          0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
          -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
          0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        ])

        const n = 9;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return n;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0, 0, 0, 1);

      const u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
      const viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

      const modelMatrix = new Matrix4();
      modelMatrix.setRotate(-90, 0, 0, 1);

      const modelViewMatrix = viewMatrix.multiply(modelMatrix);

      gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);


      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, n);
    }

    // with key control
    const test4 = gl => {
      const VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_ViewMatrix;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_ViewMatrix * a_Position;
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
          0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
          -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
          0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

          0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
          -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
          0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

          0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
          -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
          0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        ])

        const n = 9;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return n;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0, 0, 0, 1);

      const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

      const viewMatrix = new Matrix4();

      let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25;
      const keydown = (ev, gl, n, u_ViewMatrix, viewMatrix) => {
        if (ev.keyCode === 39) {
          // 按下右键
          g_eyeX += 0.01;
        }  else if (ev.keyCode === 37) {
          // 按下左键
          g_eyeX -= 0.01;
        } else {
          return
        }

        draw(gl, n, u_ViewMatrix, viewMatrix);
      }

      const draw = (gl, n, u_ViewMatrix, viewMatrix) => {
        viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0,0,0,0,1,0);

        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, n);
      }

      document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
      }

      draw(gl, n, u_ViewMatrix, viewMatrix);
    }
  }
}
</script>

<style scoped>

</style>

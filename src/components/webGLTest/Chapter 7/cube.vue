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
  name: "cube",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(255.0, 0, 255.0, 1.0)
      // test1(gl)
      test2(gl)
    })

    const test1 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_MvpMatrix;
        varying vec4 v_Color;
        void main () {
          gl_Position = u_MvpMatrix * a_Position;
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
      const initVertexBuffers = gl => {
        // Create a cube
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        const verticesColors = new Float32Array([
          // 顶点坐标和颜色
          1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
          -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
          -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
          1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
          1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
          1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
          -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
          -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
        ]);

        // 顶点索引
        const indices = new Uint8Array([
          0, 1, 2,   0, 2, 3,    // front
          0, 3, 4,   0, 4, 5,    // right
          0, 5, 6,   0, 6, 1,    // up
          1, 6, 7,   1, 7, 2,    // left
          7, 4, 3,   7, 3, 2,    // down
          4, 7, 6,   4, 6, 5     // back
        ]);

        const vertexColorBuffer = gl.createBuffer();
        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

        const FSIZE = verticesColors.BYTES_PER_ELEMENT;

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
        gl.enableVertexAttribArray(a_Position);

        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
        gl.enableVertexAttribArray(a_Color);

        // 将顶点索引数据写入缓冲区
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      const mvpMatrix = new Matrix4();
      mvpMatrix.setPerspective(30, 1,1,100);
      mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);

      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }


    const test2 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_MvpMatrix;
        varying vec4 v_Color;
        void main () {
          gl_Position = u_MvpMatrix * a_Position;
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
      const initArrayBuffer = (gl, data, num, type, attribute) => {
        const buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        const a_attribute = gl.getAttribLocation(gl.program, attribute);
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute)

        return true
      }

      const initVertexBuffers = gl => {
        // Create a cube
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3

        const vertices = new Float32Array([   // Vertex coordinates
          1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
          1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
          1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
          -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
          -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
          1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
        ]);

        const colors = new Float32Array([     // Colors
          0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
          0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
          1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
          1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
          1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
          0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ]);

        const indices = new Uint8Array([       // Indices of the vertices
          0, 1, 2,   0, 2, 3,    // front
          4, 5, 6,   4, 6, 7,    // right
          8, 9,10,   8,10,11,    // up
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // down
          20,21,22,  20,22,23     // back
        ]);

        initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
        initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color');

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const mvpMatrix = new Matrix4();
      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(-3, -3, -7, 0, 0, 0, 0, 1, 0);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }
  }
}
</script>

<style scoped>

</style>

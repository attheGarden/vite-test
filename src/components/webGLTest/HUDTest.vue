<template>
  <div>
    <canvas id="webgl" width="400" height="400" style="position: absolute; z-index: 0"/>
    <canvas id="hud" width="400" height="400" style="position: absolute; z-index: 1"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../utils/wegblUtils";
import {Matrix4, Vector3} from "../../utils/cuon-matrix";

export default {
  name: "HUDTest",
  setup() {
    let gl;
    onMounted(() => {
      let canvas1 = document.getElementById('hud');
      let ctx = canvas1.getContext('2d');
      const clock = () => {
        ctx.save()
        ctx.clearRect(0, 0, 600, 600)
        ctx.translate(300, 300);
        ctx.save()

        ctx.beginPath()
        ctx.arc(0, 0, 100, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        const time = new Date();
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();

        // 时针
        ctx.rotate(2 * Math.PI / 12 * hour + 2 * Math.PI / 12 * (min / 60) - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 分针
        ctx.rotate(2 * Math.PI / 60 * min + 2 * Math.PI / 60 * (sec / 60) - Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(60, 0);
        ctx.lineWidth=5;
        ctx.strokeStyle = 'blue'
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 秒针
        ctx.rotate(2 * Math.PI / 60 * sec - Math.PI / 2)
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(80, 0);
        ctx.lineWidth=2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.save();

        // 刻度
        ctx.lineWidth=1;
        for (let i = 0; i < 60; i++) {
          ctx.rotate(2 * Math.PI / 60)
          ctx.beginPath()
          ctx.moveTo(90, 0)
          ctx.lineTo(100, 0)
          // ctx.strokeStyle = 'red'
          ctx.stroke()
          ctx.closePath()
        }
        ctx.restore()
        ctx.save()
        ctx.lineWidth = 5
        for (let i = 0; i < 12; i++) {
          ctx.rotate(2 * Math.PI / 12)
          ctx.beginPath()
          ctx.moveTo(85, 0)
          ctx.lineTo(100, 0)
          ctx.stroke()
          ctx.closePath()
        }
        ctx.restore()
        ctx.restore()
        requestAnimationFrame(clock)
      }
      requestAnimationFrame(clock)

      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(255, 255, 255, 1.0)
      // test1(gl, canvas);
      lightCube(gl);

    })
    const lightCube = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal; // 法向量
        uniform mat4 u_MvpMatrix;
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        varying vec4 v_Color;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          vec3 normal = normalize(vec3(a_Normal));
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(u_LightDirection, normal), 0.0);
          // 计算漫反射光的颜色
          vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
          v_Color = vec4(diffuse, a_Color.a);
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

      const initArrayBuffer = (gl, attribute, data, num, type) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        const a_attribute = gl.getAttribLocation(gl.program, attribute);
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);

        gl.enableVertexAttribArray(a_attribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }

      const initVertexBuffers = gl => {
        const vertices = new Float32Array([   // Coordinates
          1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
          1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
          1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
          -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
          -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
          1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
        ]);


        const colors = new Float32Array([    // Colors
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
          1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
        ]);


        const normals = new Float32Array([    // Normal
          0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
          1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
          0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
          -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
          0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
          0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);


        // Indices of the vertices
        const indices = new Uint8Array([
          0, 1, 2,   0, 2, 3,    // front
          4, 5, 6,   4, 6, 7,    // right
          8, 9,10,   8,10,11,    // up
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // down
          20,21,22,  20,22,23     // back
        ]);

        initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
        initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT);
        initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
      }

      const n = initVertexBuffers(gl);
      gl.clearColor(255,255,255,1);
      gl.enable(gl.DEPTH_TEST);

      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const u_LightColor= gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');

      // 设置光线颜色 白色
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

      // 设置光线方向 (世界坐标下)
      const lightDirection = new Vector3([0.5, 3.0, 4.0]);

      lightDirection.normalize();
      gl.uniform3fv(u_LightDirection, lightDirection.elements);

      const mvpMatrix = new Matrix4();
      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);

      // 模型视图矩阵传递给u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };
  }
}
</script>

<style scoped>

</style>

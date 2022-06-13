<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../../utils/wegblUtils";
import {Matrix4, Vector3} from "../../../utils/cuon-matrix";

export default {
  name: "lightCube",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(0, 0, 0, 1.0)
      // test1(gl, canvas);
      // lightCube(gl);
      // lightCube_ambient(gl);
      // lightTranslatedRotatedCube(gl);
      // PointLightCube(gl);
      PointLightCube_perFragment(gl);

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
      gl.clearColor(0,0,0,1);
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

    const lightCube_ambient = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal; // 法向量
        uniform mat4 u_MvpMatrix;
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_AmbientLight; // 环境光颜色
        varying vec4 v_Color;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          vec3 normal = normalize(vec3(a_Normal));
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(u_LightDirection, normal), 0.0);
          // 计算漫反射光的颜色
          vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
          // 计算环境光产生的反射光的颜色
          vec3 ambient = u_AmbientLight * a_Color.rgb;
          // 相加得到最终颜色
          v_Color = vec4(diffuse + ambient, a_Color.a);
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
      gl.clearColor(0,0,0,1);
      gl.enable(gl.DEPTH_TEST);

      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const u_LightColor= gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
      const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');


      // 设置光线颜色 白色
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

      // 设置光线方向 (世界坐标下)
      const lightDirection = new Vector3([0.5, 3.0, 4.0]);

      lightDirection.normalize();
      gl.uniform3fv(u_LightDirection, lightDirection.elements);
      gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

      const mvpMatrix = new Matrix4();
      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);

      // 模型视图矩阵传递给u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    const lightTranslatedRotatedCube = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal; // 法向量
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix; // 用于变换法向量的矩阵
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_AmbientLight; // 环境光颜色
        varying vec4 v_Color;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          // 计算变换后的法向量并且归一化
          vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(u_LightDirection, normal), 0.0);
          // 计算漫反射光的颜色
          vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
          // 计算环境光产生的反射光的颜色
          vec3 ambient = u_AmbientLight * a_Color.rgb;
          // 相加得到最终颜色
          v_Color = vec4(diffuse + ambient, a_Color.a);
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
      gl.clearColor(0,0,0,1);
      gl.enable(gl.DEPTH_TEST);

      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
      const u_LightColor= gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
      const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');


      // 设置光线颜色 白色
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

      // 设置光线方向 (世界坐标下)
      const lightDirection = new Vector3([0.0, 3.0, 4.0]);

      lightDirection.normalize();
      gl.uniform3fv(u_LightDirection, lightDirection.elements);
      gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

      const mvpMatrix = new Matrix4();
      const modelMatrix = new Matrix4();
      const normalMatrix = new Matrix4(); // 变换法向量的矩阵
      modelMatrix.setTranslate(0, 0.3, 0); // y轴平移
      modelMatrix.rotate(45, 0, 1, 1); // z轴旋转


      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);
      mvpMatrix.multiply(modelMatrix);

      // 模型视图矩阵传递给u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      // 根据模型矩阵计算用来变换法向量的矩阵
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    const PointLightCube = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal; // 法向量
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_ModelMatrix; // 模型矩阵
        uniform mat4 u_NormalMatrix; // 用于变换法向量的矩阵
        uniform vec3 u_LightColor;
        uniform vec3 u_LightPosition; // 光源位置 (世界坐标系)
        uniform vec3 u_AmbientLight; // 环境光颜色
        varying vec4 v_Color;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          // 计算变换后的法向量并且归一化
          vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
          // 计算顶点的世界坐标
          vec4 vertexPosition = u_ModelMatrix * a_Position;
          // 计算光线方向并归一化
          vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(lightDirection, normal), 0.0);
          // 计算漫反射光的颜色
          vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
          // 计算环境光产生的反射光的颜色
          vec3 ambient = u_AmbientLight * a_Color.rgb;
          // 相加得到最终颜色
          v_Color = vec4(diffuse + ambient, a_Color.a);
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
          2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
          2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
          2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
          -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
          -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
          2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0
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
      gl.clearColor(0,0,0,1);
      gl.enable(gl.DEPTH_TEST);

      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
      const u_LightColor= gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
      const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');


      // 设置光线颜色 白色
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

      gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);

      gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

      const mvpMatrix = new Matrix4();
      const modelMatrix = new Matrix4();
      const normalMatrix = new Matrix4(); // 变换法向量的矩阵
      // modelMatrix.setTranslate(0, 0.3, 0); // y轴平移
      modelMatrix.rotate(90, 0, 1, 0); // z轴旋转
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(6,6,14,0,0,0,0,1,0);
      mvpMatrix.multiply(modelMatrix);

      // 模型视图矩阵传递给u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      // 根据模型矩阵计算用来变换法向量的矩阵
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };

    const PointLightCube_perFragment = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal; // 法向量
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_ModelMatrix; // 模型矩阵
        uniform mat4 u_NormalMatrix; // 用于变换法向量的矩阵


        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          v_Position = vec3(u_ModelMatrix * a_Position);
          v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
          v_Color = a_Color;
        }
      `

      const FSHADER_SOURCE = `
        precision mediump float;

        uniform vec3 u_LightColor;
        uniform vec3 u_LightPosition; // 光源位置 (世界坐标系)
        uniform vec3 u_AmbientLight; // 环境光颜色

        varying vec4 v_Color;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        void main() {
          // 法线归一化, 因为内插后长度不一定为1
          vec3 normal = normalize(v_Normal);
          // 计算光线方向并归一化
          vec3 lightDirection = normalize(u_LightPosition - v_Position);
          // 计算光线方向和法向量的点积
          float nDotL = max(dot(lightDirection, normal), 0.0);

          vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
          vec3 ambient = u_AmbientLight * v_Color.rgb;

          gl_FragColor = vec4(diffuse + ambient, v_Color);
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
          2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
          2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
          2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
          -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
          -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
          2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0
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
      gl.clearColor(0,0,0,1);
      gl.enable(gl.DEPTH_TEST);

      const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
      const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
      const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
      const u_LightColor= gl.getUniformLocation(gl.program, 'u_LightColor');
      const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
      const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');


      // 设置光线颜色 白色
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

      gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);

      gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

      const mvpMatrix = new Matrix4();
      const modelMatrix = new Matrix4();
      const normalMatrix = new Matrix4(); // 变换法向量的矩阵
      // modelMatrix.setTranslate(0, 0.3, 0); // y轴平移
      modelMatrix.rotate(90, 0, 1, 0); // z轴旋转
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

      mvpMatrix.setPerspective(30, 1, 1, 100);
      mvpMatrix.lookAt(6,6,14,0,0,0,0,1,0);
      mvpMatrix.multiply(modelMatrix);

      // 模型视图矩阵传递给u_MvpMatrix
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      // 根据模型矩阵计算用来变换法向量的矩阵
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    };
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <canvas id="webgl" width="400" height="400"/>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {initShaders} from "../../../utils/wegblUtils";

export default {
  name: "textureOperation",
  setup() {
    let gl;
    onMounted(() => {
      const canvas = document.getElementById('webgl')
      gl = canvas.getContext('webgl')
      gl.clearColor(255.0, 0, 255.0, 1.0)
      // test2(gl)
      test1(gl)
    })

    const initVertexBuffers = gl => {
      const verticesTexCoords = new Float32Array([
        // 顶点坐标   纹理坐标
        -1.0, 1.0, -0.3, 1.7,
        -1.0, -1.0, -0.3, -0.2,
        1.0, 1.0, 1.7, 1.7,
        1.0, -1.0, 1.7, -0.2
      ])

      const n = 4

      const vertexTexCoordsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

      const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
      const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
      gl.enableVertexAttribArray(a_Position)

      const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
      gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
      gl.enableVertexAttribArray(a_TexCoord)

      return n
    }

    const initTextures = (gl, n) => {
      const texture = gl.createTexture(); // 创建纹理对象

      const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
      const image = new Image();
      image.onload = () => {
        loadTexture(gl, n, texture, u_Sampler, image);
      }
      image.src = '../../../../public/image/img.png'

      return true;
    }

    const loadTexture = (gl, n, texture, u_Sampler, image) => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      // 开启0号纹理单元
      gl.activeTexture(gl.TEXTURE0);
      // 向target绑定纹理对象
      gl.bindTexture(gl.TEXTURE_2D, texture);


      // 配置纹理对象
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      // 配置纹理图像 位图文件分辨率必须为64*64, 128*128, 256*256三种格式之一
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      // 将0号纹理传递给着色器
      gl.uniform1i(u_Sampler, 0);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }

    // 纹理
    const test1 = gl => {
      const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        void main() {
          gl_Position = a_Position;
          v_TexCoord = a_TexCoord;
        }
      `
      const FSHADER_SOURCE = `
        precision mediump float;
        uniform sampler2D u_Sampler;
        varying vec2 v_TexCoord;
        void main() {
          gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        }
      `

      initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
      const n = initVertexBuffers(gl)
      initTextures(gl, n)
    }
  }
}
</script>

<style scoped>

</style>

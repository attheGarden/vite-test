<template>
  <div class="text">
    恭喜你获得了 60 原石!
  </div>
  <canvas id="cardCover" width="400" height="150"></canvas>
</template>

<script>
export default {
  name: 'card',
  setup() {

  }
}
</script>

<style lang="less" scoped>
.text {
  position: absolute;
  left: 130px;
  top: 35px;
  z-index: -1;
}
</style>

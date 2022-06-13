import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'clock',
    component: () => import('../components/clock.vue')
  },
  {
    path: '/card',
    name: 'card',
    component: () => import('../components/card.vue')
  },
  {
    path: '/moveStar',
    name: 'moveStar',
    component: () => import('../components/moveStar.vue')
  },
  {
    path: '/snake',
    name: 'snake',
    component: () => import('../components/snake.vue')
  },
  {
    path: '/disappear',
    name: 'disappear',
    component: () => import('../components/disappear.vue')
  },
  {
    path: '/simpleTest',
    name: 'simpleTest',
    component: () => import('../components/simpleTest.vue')
  },
  {
    path: '/webglTest',
    name: 'webglTest',
    component: () => import('../components/webGLTest/webGLTest.vue')
  },
  {
    path: '/webglTest3',
    name: 'webglTest3',
    component: () => import('../components/webGLTest/Chapter 3/rotationAndScale.vue')
  },
  {
    path: '/webglTest4_1',
    name: 'webglTest4_1',
    component: () => import('../components/webGLTest/Chapter 4/modelTransform.vue')
  },
  {
    path: '/webglTest5_1',
    name: 'webglTest5_1',
    component: () => import('../components/webGLTest/Chapter 5/test1.vue')
  },
  {
    path: '/webglTest5_2',
    name: 'webglTest5_2',
    component: () => import('../components/webGLTest/Chapter 5/multiAttributeColor.vue')
  },
  {
    path: '/webglTest5_3',
    name: 'webglTest5_3',
    component: () => import('../components/webGLTest/Chapter 5/textureOperation.vue')
  },
  {
    path: '/webglTest7_1',
    name: 'webglTest7_1',
    component: () => import('../components/webGLTest/Chapter 7/lookAtTriangles.vue')
  },
  {
    path: '/webglTest7_2',
    name: 'webglTest7_2',
    component: () => import('../components/webGLTest/Chapter 7/perspectiveView.vue')
  },
  {
    path: '/webglTest7_3',
    name: 'webglTest7_3',
    component: () => import('../components/webGLTest/Chapter 7/cube.vue')
  },
  {
    path: '/webglTest8_1',
    name: 'webglTest8_1',
    component: () => import('../components/webGLTest/Chapter 8/lightCube.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;

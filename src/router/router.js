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
    component: () => import('../components/webGLTest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;

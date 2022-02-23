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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;

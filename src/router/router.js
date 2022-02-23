import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'clock',
    component: () => import('../components/clock.vue')
  },
  {
    path: '/12',
    name: 'ofCard',
    component: () => import('../components/card.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;

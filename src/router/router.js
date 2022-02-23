import {createRouter, createWebHistory} from 'vue-router'
import clock from '../components/clock.vue'
import card from '../components/card.vue'

const routes = [
  {
    path: '/',
    name: 'clock',
    components: clock
  },
  {
    path: '/card',
    name: 'card',
    components: card
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;

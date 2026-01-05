import welcome from '@/components/Welcome.vue'
import Inicio from '@/pages/inicio.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/', component: Inicio, children: [
      {path: '/', component: welcome}
    ]
  }],
})

export default router

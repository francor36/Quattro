import GrillaProductos from '@/components/grillaProductos.vue'
import Nosotros from '@/components/nosotros.vue'
import welcome from '@/components/Welcome.vue'
import Checkout from '@/pages/checkout.vue'
import Inicio from '@/pages/inicio.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/', component: Inicio, children: [
      {path: '/', component: welcome},
      {path: 'productos', component: GrillaProductos},
      {path: 'nosotros', component: Nosotros},
      {path: 'checkout', component: Checkout}
    ]
  }],
})

export default router

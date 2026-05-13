<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCarritoStore } from '@/stores/carrito';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const router = useRouter();

const cargando = ref(false);
const error = ref('');
const mostrarModalLogin = ref(false);
const paso = ref<'normal' | 'procesando' | 'error'>('normal');

const formatoPrecio = (precio: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

const BASE_URL = 'http://localhost:3000';

// Crear orden usando datos del usuario logueado
const crearOrden = async (): Promise<number | null> => {
  if (!authStore.token || !authStore.usuario) {
    throw new Error('Usuario no autenticado');
  }

  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token}`
  };

  const body = {
    nombre_cliente: authStore.usuario.nombre,
    email_cliente: authStore.usuario.email,
    items: carritoStore.items.map(item => ({
      product_id: item.producto.id,
      quantity: item.cantidad,
      unit_price: item.producto.price,
    })),
    total_amount: carritoStore.precioTotal,
  };

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Error al crear la orden');
  }

  return data.order_id;
};

// Crear preferencia de MercadoPago
const crearPreferencia = async (orderId: number): Promise<string> => {
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.token!}`
  };

  const response = await fetch(`${BASE_URL}/api/payments/mp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ orderId }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Error al crear preferencia de pago');
  }

  return data.init_point;
};

// Ir al login
const irAlLogin = () => {
  mostrarModalLogin.value = false;
  router.push({ name: 'login', query: { redirect: '/checkout' } });
};

// FUNCIÓN PRINCIPAL: Verifica login al hacer clic
const confirmarCompra = async () => {
  // 🔒 VERIFICACIÓN INMEDIATA: ¿Está logueado?
  if (!authStore.token || !authStore.usuario?.nombre || !authStore.usuario?.email) {
    mostrarModalLogin.value = true;
    return;
  }

  if (carritoStore.carritoVacio) {
    error.value = 'Tu carrito está vacío';
    return;
  }

  cargando.value = true;
  error.value = '';
  paso.value = 'procesando';

  try {
    const orderId = await crearOrden();
    if (!orderId) throw new Error('No se pudo crear la orden');

    const initPoint = await crearPreferencia(orderId);

    carritoStore.vaciarCarrito();
    window.location.href = initPoint;

  } catch (err: any) {
    console.error('Error en checkout:', err);
    error.value = err.message || 'Ocurrió un error al procesar tu compra';
    paso.value = 'error';
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen font-serif py-12 px-4" style="background-color: #fff1da">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-12 text-center" style="color: #0e516c">Finalizar Compra</h1>

      <!-- ✅ MODAL: Solo aparece al hacer clic en "Pagar" sin estar logueado -->
      <Transition name="fade">
        <div
          v-if="mostrarModalLogin"
          class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          @click.self="mostrarModalLogin = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-200" style="border: 3px solid #0e516c">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50" style="border: 3px solid #dc2626">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>

            <h2 class="text-2xl font-bold mb-3" style="color: #0e516c">¡Iniciá sesión primero!</h2>
            <p class="text-gray-600 mb-8 text-lg leading-relaxed">
              Necesitás estar logueado para poder pagar con MercadoPago.
            </p>

          </div>
        </div>
      </Transition>

      <!-- Procesando -->
      <div v-if="paso === 'procesando'" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-20 w-20 border-b-4 mb-8" style="border-color: #0e516c"></div>
        <p class="text-2xl font-bold mb-2" style="color: #0e516c">Preparando pago seguro...</p>
        <p class="text-lg text-gray-600">Redirigiendo a MercadoPago</p>
      </div>

      <!-- Error -->
      <div v-else-if="paso === 'error'" class="text-center py-20 max-w-lg mx-auto">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-4 text-red-600">Error en el pago</h2>
        <p class="text-gray-600 mb-8 text-lg">{{ error }}</p>
        <button
          @click="paso = 'normal'; error = ''"
          class="px-12 py-4 rounded-xl font-bold text-xl text-white shadow-lg hover:shadow-xl transition-all"
          style="background: linear-gradient(135deg, #0e516c 0%, #1e6b8a 100%)"
        >
          Intentar nuevamente
        </button>
      </div>

      <!-- ✅ VISTA PRINCIPAL: Solo productos con foto pequeña -->
      <div v-else class="space-y-8">
        
        <!-- ✅ Lista de productos con foto pequeña -->
        <div class="bg-white rounded-2xl shadow-xl p-8" style="border: 2px solid #0e516c">
          <h2 class="text-3xl font-bold mb-8 text-center" style="color: #0e516c">Tu pedido</h2>
          
          <div class="space-y-6">
            <div
              v-for="item in carritoStore.items"
              :key="item.producto.id"
              class="flex items-center gap-6 p-6 bg-gray-50/50 rounded-xl hover:shadow-md transition-all border"
              style="border-color: #fff1da"
            >
              <!-- ✅ Foto pequeña del producto -->
              <div class="w-20 h-20 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-white">
                <img 
                  :src="item.producto.image || '/placeholder-producto.jpg'" 
                  :alt="item.producto.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
              </div>

              <!-- Detalles -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg mb-1 truncate" style="color: #0e516c">{{ item.producto.name }}</h3>
                <p class="text-sm text-gray-500 mb-2">x{{ item.cantidad }}</p>
                <p class="text-2xl font-bold" style="color: #0e516c">
                  {{ formatoPrecio(item.producto.price * item.cantidad) }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatoPrecio(item.producto.price) }} c/u
                </p>
              </div>

              <!-- Subtotal -->
              <div class="text-right">
                <p class="text-2xl font-bold" style="color: #0e516c">
                  {{ formatoPrecio(item.producto.price * item.cantidad) }}
                </p>
              </div>
            </div>
          </div>

          <!-- ✅ TOTAL GRANDE Y BOTÓN PRINCIPAL -->
          <div class="mt-12 pt-8 border-t-4 border-dashed flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl" style="border-color: #0e516c">
            <div>
              <p class="text-2xl font-bold text-center sm:text-left mb-2" style="color: #0e516c">
                Total: {{ carritoStore.items.length }} {{ carritoStore.items.length === 1 ? 'producto' : 'productos' }}
              </p>
              <p class="text-sm text-gray-500 text-center sm:text-left">Impuestos incluidos</p>
            </div>
            
            <button
              @click="confirmarCompra"
              :disabled="cargando || carritoStore.carritoVacio"
              class="group relative px-12 py-6 rounded-2xl font-bold text-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 w-full sm:w-auto"
              style="background: linear-gradient(135deg, #0e516c 0%, #1e6b8a 50%, #0e516c 100%); min-height: 72px"
            >
              <!-- Spinner si está cargando -->
              <div v-if="cargando" class="absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-white/80"></div>
              </div>
              
              <!-- Icono -->
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="group-hover:scale-110 transition-transform">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              
              <!-- Texto -->
              <span class="relative z-10">
                {{ cargando ? 'Procesando...' : 'Pagar con MercadoPago' }}
              </span>
              
              <!-- Precio flotante -->
              <div class="absolute -top-2 -right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-lg" style="color: #0e516c">
                {{ formatoPrecio(carritoStore.precioTotal) }}
              </div>
            </button>
          </div>

          <!-- Aviso de seguridad -->
          <p class="text-center mt-8 text-sm text-gray-500 pt-6 border-t" style="border-color: #fff1da">
            🔒 Pago 100% seguro con MercadoPago • Redirigirás al sitio oficial
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.animate-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
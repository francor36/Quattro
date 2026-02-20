<script setup lang="ts">
import { useCarritoStore } from '@/stores/carrito';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const carritoStore = useCarritoStore();

const formatoPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(precio);
};

const incrementarCantidad = (productoId: number) => {
  const item = carritoStore.items.find(i => i.producto.id === productoId);
  if (item) {
    carritoStore.actualizarCantidad(productoId, item.cantidad + 1);
  }
};

const decrementarCantidad = (productoId: number) => {
  const item = carritoStore.items.find(i => i.producto.id === productoId);
  if (item) {
    carritoStore.actualizarCantidad(productoId, item.cantidad - 1);
  }
};

const finalizarCompra = () => {
  if (carritoStore.carritoVacio) {
    alert('El carrito está vacío');
    return;
  }
  carritoStore.cerrarCarrito();
  router.push('/checkout');
};
</script>

<template>

  <div 
    v-if="carritoStore.mostrarCarrito"
    @click="carritoStore.cerrarCarrito"
    class="fixed inset-0 bg-opacity-10 z-40 transition-opacity backdrop-blur-sm"
  ></div>

  
  <div 
    :class="carritoStore.mostrarCarrito ? 'translate-x-0' : 'translate-x-full'"
    class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
  >
    <!-- Header -->
    <div class="p-6 border-b-2 flex items-center justify-between" style="border-color: #0e516c; background-color: #fff1da">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <h2 class="text-2xl font-bold" style="color: #0e516c">
          Carrito ({{ carritoStore.cantidadTotal }})
        </h2>
      </div>
      <button 
        @click="carritoStore.cerrarCarrito"
        class="p-2 hover:bg-white rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Items del carrito -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Carrito vacío -->
      <div v-if="carritoStore.carritoVacio" class="flex flex-col items-center justify-center h-full text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="1.5" class="mb-4 opacity-50">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <p class="text-xl font-semibold mb-2" style="color: #0e516c">Tu carrito está vacío</p>
        <p class="text-gray-600">Agrega productos para comenzar</p>
      </div>

      <!-- Lista de items -->
      <div v-else class="space-y-4">
        <div 
          v-for="item in carritoStore.items" 
          :key="item.producto.id"
          class="bg-white border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
          style="border-color: #fff1da"
        >
          <div class="flex gap-4">
            <!-- Imagen -->
            <div class="w-20 h-20 shrink-0 rounded-lg overflow-hidden" style="background-color: #fff1da">
              <img 
                v-if="item.producto.image" 
                :src="item.producto.image" 
                :alt="item.producto.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-sm mb-1 line-clamp-2" style="color: #0e516c">
                {{ item.producto.name }}
              </h3>
              <p class="text-lg font-bold mb-2" style="color: #0e516c">
                {{ formatoPrecio(item.producto.price) }}
              </p>

              <!-- Controles de cantidad -->
              <div class="flex items-center gap-2">
                <button 
                  @click="decrementarCantidad(item.producto.id)"
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors hover:opacity-80"
                  style="background-color: #0e516c; color: white"
                >
                  -
                </button>
                <span class="w-12 text-center font-bold" style="color: #0e516c">
                  {{ item.cantidad }}
                </span>
                <button 
                  @click="incrementarCantidad(item.producto.id)"
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors hover:opacity-80"
                  style="background-color: #0e516c; color: white"
                >
                  +
                </button>
                <button 
                  @click="carritoStore.eliminarProducto(item.producto.id)"
                  class="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>

              <!-- Subtotal -->
              <p class="text-sm font-semibold mt-2" style="color: #0e516c">
                Subtotal: {{ formatoPrecio(item.producto.price * item.cantidad) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con total y botones -->
    <div v-if="!carritoStore.carritoVacio" class="border-t-2 p-6 space-y-4" style="border-color: #0e516c; background-color: #fff1da">
      <!-- Total -->
      <div class="flex items-center justify-between text-xl font-bold" style="color: #0e516c">
        <span>Total:</span>
        <span>{{ formatoPrecio(carritoStore.precioTotal) }}</span>
      </div>

      <!-- Botones -->
      <div class="space-y-2">
        <button 
          @click="finalizarCompra"
          class="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
          style="background-color: #0e516c"
        >
          Finalizar Compra
        </button>
        <button 
          @click="carritoStore.vaciarCarrito"
          class="w-full py-3 rounded-lg font-bold transition-all hover:opacity-90"
          style="background-color: white; color: #0e516c; border: 2px solid #0e516c"
        >
          Vaciar Carrito
        </button>
      </div>
    </div>
  </div>
</template>
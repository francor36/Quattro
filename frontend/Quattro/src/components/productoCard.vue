<script setup lang="ts">
import type { Producto } from '@/types/producto';

defineProps<{
  producto: Producto;
}>();

const emit = defineEmits<{
  verDetalle: [id: number];
  agregarCarrito: [producto: Producto];
}>();

const formatoPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(precio);
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 font-serif" style="border: 2px solid #fff1da">
    <!-- Imagen del producto -->
    <div class="relative h-64 overflow-hidden" style="background-color: #f5f5f5">
      <img 
        v-if="producto.imagen" 
        :src="producto.imagen" 
        :alt="producto.titulo"
        class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center" style="background-color: #fff">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      
      <!-- Badge de stock bajo (opcional) -->
      <div v-if="producto.stock && producto.stock < 5" class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-black" style="background-color: #ff4444">
        ¡Últimas unidades!
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-4">
      <!-- Categoría (opcional) -->
      <p v-if="producto.categoria" class="text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #0e516c">
        {{ producto.categoria }}
      </p>

      <!-- Título -->
      <h3 class="text-lg font-bold mb-2 line-clamp-2 min-h-14" style="color: #0e516c">
        {{ producto.titulo }}
      </h3>

      <!-- Descripción (opcional) -->
      <p v-if="producto.descripcion" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ producto.descripcion }}
      </p>

      <!-- Precio -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-2xl font-bold" style="color: #0e516c">
          {{ formatoPrecio(producto.precio) }}
        </span>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-2">
        <button 
          @click="emit('verDetalle', producto.id)"
          class="flex-1 py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-90"
          style="background-color: #fff1da; color: #0e516c"
        >
          Ver más
        </button>
        <button 
          @click="emit('agregarCarrito', producto)"
          class="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style="background-color: #0e516c"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>
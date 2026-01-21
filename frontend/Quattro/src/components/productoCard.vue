<script setup lang="ts">
import type { Producto } from '@/types/producto';
import { computed } from 'vue';

const props = defineProps<{
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

// Verificar si tiene stock
const tieneStock = computed(() => {
  // Si stock es undefined, asumimos que SÍ hay stock
  if (props.producto.stock === undefined) return true;
  // Si stock está definido, verificamos que sea mayor a 0
  return props.producto.stock > 0;
});

// Clase de stock bajo
const stockBajo = computed(() => {
  if (props.producto.stock === undefined) return false;
  return props.producto.stock > 0 && props.producto.stock < 5;
});
</script>

<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    :class="{ 'opacity-75': !tieneStock }"
    style="border: 2px solid #fff1da"
  >
    <!-- Overlay de sin stock -->
    <div 
      v-if="!tieneStock"
      class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center"
    >
      <div class="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl transform -rotate-12">
        SIN STOCK
      </div>
    </div>

    <!-- Imagen del producto -->
    <div class="relative h-64 overflow-hidden" style="background-color: #f5f5f5">
      <img 
        v-if="producto.imagen" 
        :src="producto.imagen" 
        :alt="producto.titulo"
        class="w-full h-full object-cover transition-transform duration-300"
        :class="{ 'hover:scale-110': tieneStock, 'grayscale': !tieneStock }"
      />
      <div v-else class="w-full h-full flex items-center justify-center" style="background-color: #fff1da">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#0e516c" 
          stroke-width="2"
          :class="{ 'opacity-50': !tieneStock }"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      
      <!-- Badge de stock bajo -->
      <div 
        v-if="stockBajo && tieneStock" 
        class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white animate-pulse" 
        style="background-color: #ff4444"
      >
        ¡Últimas {{ producto.stock }} unidades!
      </div>

      <!-- Badge de sin stock -->
      <div 
        v-if="!tieneStock" 
        class="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white" 
        style="background-color: #666"
      >
        Agotado
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-4">
      <!-- Categoría -->
      <p 
        v-if="producto.categoria" 
        class="text-xs font-semibold mb-2 uppercase tracking-wide" 
        :class="{ 'opacity-50': !tieneStock }"
        style="color: #0e516c"
      >
        {{ producto.categoria }}
      </p>

      <!-- Título -->
      <h3 
        class="text-lg font-bold mb-2 line-clamp-2 min-h-14" 
        :class="{ 'opacity-70': !tieneStock }"
        style="color: #0e516c"
      >
        {{ producto.titulo }}
      </h3>

      <!-- Descripción -->
      <p 
        v-if="producto.descripcion" 
        class="text-sm text-gray-600 mb-3 line-clamp-2"
        :class="{ 'opacity-50': !tieneStock }"
      >
        {{ producto.descripcion }}
      </p>

      <!-- Stock disponible -->
      <div v-if="producto.stock !== undefined" class="mb-2">
        <p v-if="tieneStock" class="text-sm font-semibold" style="color: #0e516c">
          Stock disponible: {{ producto.stock }} unidades
        </p>
        <p v-else class="text-sm font-semibold text-red-600">
          Producto agotado
        </p>
      </div>

      <!-- Precio -->
      <div class="flex items-center justify-between mb-4">
        <span 
          class="text-2xl font-bold" 
          :class="{ 'opacity-60': !tieneStock }"
          style="color: #0e516c"
        >
          {{ formatoPrecio(producto.precio) }}
        </span>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-2">
        <button 
          @click="emit('verDetalle', producto.id)"
          class="flex-1 py-2 px-4 rounded-lg font-semibold transition-all"
          :class="tieneStock ? 'hover:opacity-90' : 'cursor-not-allowed'"
          style="background-color: #fff1da; color: #0e516c"
        >
          Ver más
        </button>
        <button 
          @click="tieneStock ? emit('agregarCarrito', producto) : null"
          :disabled="!tieneStock"
          class="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all"
          :class="tieneStock ? 'hover:opacity-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'"
          style="background-color: #0e516c"
        >
          {{ tieneStock ? 'Agregar' : 'No disponible' }}
        </button>
      </div>
    </div>
  </div>
</template>
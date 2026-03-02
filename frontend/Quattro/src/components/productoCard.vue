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

const handleAgregarCarrito = () => {
  if (tieneStock.value) {
    emit('agregarCarrito', props.producto);
  }
};
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
        v-if="producto.image" 
        :src="producto.image" 
        :alt="producto.name"
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

      <!-- Botón de añadir al carrito flotante -->
      <button
        v-if="tieneStock"
        @click="handleAgregarCarrito"
        class="absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all hover:scale-110 group"
        style="background-color: #0e516c"
        title="Añadir al carrito"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#fff1da" 
          stroke-width="2"
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="group-hover:scale-110 transition-transform"
        >
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      </button>
    </div>

    <!-- Información del producto -->
    <div class="p-4">
      <!-- Categoría -->
      <p 
        v-if="producto.category" 
        class="text-xs font-semibold mb-2 uppercase tracking-wide" 
        :class="{ 'opacity-50': !tieneStock }"
        style="color: #0e516c"
      >
        {{ producto.category }}
      </p>

      <!-- Título -->
      <h3 
        class="text-lg font-bold mb-2 line-clamp-2 min-h-14" 
        :class="{ 'opacity-70': !tieneStock }"
        style="color: #0e516c"
      >
        {{ producto.name }}
      </h3>

      <!-- Descripción -->
      <p 
        v-if="producto.description" 
        class="text-sm text-gray-600 mb-3 line-clamp-2"
        :class="{ 'opacity-50': !tieneStock }"
      >
        {{ producto.description }}
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
          {{ formatoPrecio(producto.price) }}
        </span>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-col gap-2">
        <!-- Botón principal de añadir al carrito -->
        <button 
          @click="handleAgregarCarrito"
          :disabled="!tieneStock"
          class="w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
          :class="tieneStock ? 'hover:opacity-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'"
          style="background-color: #0e516c"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          {{ tieneStock ? 'Añadir al carrito' : 'No disponible' }}
        </button>

        <!-- Botón secundario de ver más -->
        <button 
          @click="emit('verDetalle', producto.id)"
          class="w-full py-2 px-4 rounded-lg font-semibold transition-all hover:opacity-90"
          style="background-color: #fff1da; color: #0e516c"
        >
          Ver detalles
        </button>
      </div>
    </div>
  </div>
</template>
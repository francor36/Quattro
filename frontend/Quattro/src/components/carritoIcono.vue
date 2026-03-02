<script setup lang="ts">
import { useCarritoStore } from '@/stores/carrito';

const carritoStore = useCarritoStore();
</script>

<template>
  <button 
    @click="carritoStore.toggleCarrito"
    class="relative p-3 rounded-full transition-all hover:scale-110"
    style="background-color: #fff1da"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#0e516c" 
      stroke-width="2"
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
    

    <div 
      v-if="carritoStore.cantidadTotal > 0"
      class="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
      style="background-color: #ff4444"
    >
      {{ carritoStore.cantidadTotal }}
    </div>
  </button>
</template>
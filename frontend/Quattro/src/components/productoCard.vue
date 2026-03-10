<template>
  <div 
    class="group relative bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-[#0e516c]/5 flex flex-col h-full"
    @click="$emit('ver-detalle', producto.id)"
  >
    <div v-if="store.isAdmin" class="absolute top-4 right-4 flex gap-2 z-20">
      <button 
        @click.stop="$emit('editar', producto)" 
        class="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        title="Editar producto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button 
        @click.stop="confirmarEliminar" 
        class="bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        title="Eliminar producto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="aspect-square overflow-hidden rounded-2xl mb-4 bg-[#fff1da]/20 flex items-center justify-center">
       <img 
         :src="producto.image" 
         :alt="producto.name"
         class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
       />
    </div>

    <div class="flex flex-col flex-grow">
      <span class="text-[10px] font-bold uppercase tracking-widest text-[#0e516c]/40 mb-1">{{ producto.category }}</span>
      <h3 class="text-[#0e516c] font-serif font-bold text-lg leading-tight mb-2 line-clamp-2">{{ producto.name }}</h3>
      
      <div class="mt-auto pt-4 flex items-center justify-between">
        <span class="text-[#0e516c] font-bold text-xl">${{ producto.price }}</span>
        
        <button 
          @click.stop="$emit('agregar-carrito', producto)" 
          class="bg-[#0e516c] text-[#fff1da] p-3 rounded-xl hover:bg-[#0e516c]/90 transition-colors shadow-md active:scale-90"
          title="Añadir al carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from "@/stores/storeProduct";
import type { Producto } from "@/types/producto";

const store = useProductStore();
const props = defineProps<{ producto: Producto }>();
const emit = defineEmits(['ver-detalle', 'editar', 'agregar-carrito']);

const confirmarEliminar = () => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${props.producto.name}"?`)) {
    store.deleteProduct(props.producto.id);
  }
};
</script>
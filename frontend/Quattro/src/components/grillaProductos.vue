<template>
  <div class="relative min-h-screen bg-[#fff1da] py-12 px-4 md:px-8 overflow-hidden">
    
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0e516c]/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-[#0e516c]/5 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <header class="mb-10 text-center md:text-left">
        <h2 class="text-5xl font-serif font-bold text-[#0e516c] mb-2 tracking-tight">Catálogo</h2>
        <p class="text-[#0e516c]/70 font-serif text-lg">Explora nuestra colección curada de instrumentos</p>
      </header>

      <section class="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl shadow-[#0e516c]/5 mb-10">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-1">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c] mb-3">Buscar producto</label>
            <input v-model="busqueda" type="text" placeholder="¿Qué estás buscando hoy?"
              class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white focus:border-[#0e516c] focus:ring-2 focus:ring-[#0e516c]/10 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c] mb-3">Categoría</label>
            <select v-model="categoriaSeleccionada" class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white focus:border-[#0e516c] outline-none cursor-pointer">
              <option v-for="cat in categorias" :key="cat" :value="cat" class="capitalize">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c] mb-3">Ordenar</label>
            <select v-model="ordenamiento" class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white focus:border-[#0e516c] outline-none cursor-pointer">
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        <div class="flex justify-center mt-8">
            <button @click="limpiarFiltros" class="px-12 py-4 rounded-xl border border-[#0e516c]/20 text-[#0e516c] font-bold hover:bg-[#0e516c] hover:text-[#fff1da] transition-all">
                Limpiar filtros
            </button>
        </div>
      </section>

      <div v-if="cargando" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e516c]"></div>
      </div>

      <div v-else-if="productosFiltrados.length > 0" 
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductoCard v-for="producto in productosFiltrados" :key="producto.id" :producto="producto" @agregar-carrito="agregarCarrito" />
      </div>

      <div v-else class="text-center py-20">
        <p class="text-[#0e516c] text-xl font-serif">No encontramos productos con esos criterios.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import ProductoCard from "@/components/productoCard.vue";
import { useProductStore } from "@/stores/storeProduct";
import { useCarritoStore } from "@/stores/carrito";
import type { Producto } from "@/types/producto";

const store = useProductStore();
const carritoStore = useCarritoStore();

const busqueda = ref("");
const categoriaSeleccionada = ref("todas");
const ordenamiento = ref("relevancia");

const productos = computed(() => store.products);
const cargando = computed(() => store.loading);

const categorias = computed(() => {
  const cats = new Set(productos.value.map(p => p.category));
  return ["todas", ...Array.from(cats)];
});

const productosFiltrados = computed(() => {
  let res = [...productos.value];
  
  if (busqueda.value) {
    const term = busqueda.value.toLowerCase();
    res = res.filter(p => p.name.toLowerCase().includes(term));
  }
  
  if (categoriaSeleccionada.value !== "todas") {
    res = res.filter(p => p.category === categoriaSeleccionada.value);
  }
  
  switch (ordenamiento.value) {
    case "precio-asc": res.sort((a, b) => a.price - b.price); break;
    case "precio-desc": res.sort((a, b) => b.price - a.price); break;
  }
  
  return res;
});

const limpiarFiltros = () => {
  busqueda.value = "";
  categoriaSeleccionada.value = "todas";
  ordenamiento.value = "relevancia";
};

const agregarCarrito = (producto: Producto) => {
  if (carritoStore.agregarProducto(producto, 1)) carritoStore.abrirCarrito();
};

onMounted(() => store.fetchProducts());
</script>
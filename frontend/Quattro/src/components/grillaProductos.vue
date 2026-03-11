<template>
  <div class="relative min-h-screen bg-[#fff1da] py-12 px-4 md:px-8 overflow-hidden">
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0e516c]/10 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      
      <header class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 class="text-5xl font-serif font-bold text-[#0e516c] mb-2 tracking-tighter">Catálogo</h2>
          <p v-if="store.isAdmin" class="text-amber-700 font-bold flex items-center gap-2 text-xs uppercase tracking-widest">
            <span class="h-2 w-2 rounded-full bg-amber-700 animate-pulse"></span>
            Modo Administrador
          </p>
          <p v-else class="text-[#0e516c]/70 font-serif text-lg">Instrumentos seleccionados</p>
        </div>

        <button 
          v-if="store.isAdmin" 
          @click="abrirNuevo"
          class="bg-[#0e516c] text-[#fff1da] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95"
        >
          <span class="text-2xl leading-none">+</span> Nuevo Instrumento
        </button>
      </header>

      <section class="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl mb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c]">Buscar por nombre</label>
            <input 
              v-model="busqueda" 
              type="text" 
              placeholder="Ej: Piano, Guitarra..." 
              class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white focus:border-[#0e516c] outline-none transition-all shadow-sm" 
            />
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c]">Categoría</label>
            <select v-model="categoriaSeleccionada" class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white outline-none cursor-pointer">
              <option v-for="cat in categorias" :key="cat" :value="cat" class="capitalize">{{ cat }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold uppercase tracking-widest text-[#0e516c]">Ordenar por precio</label>
            <select v-model="ordenamiento" class="w-full px-5 py-4 rounded-xl border border-[#0e516c]/10 bg-white outline-none">
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Menor a Mayor</option>
              <option value="precio-desc">Mayor a Menor</option>
            </select>
          </div>
        </div>
      </section>

      <div v-if="store.loading" class="flex justify-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e516c]"></div>
      </div>

      <div v-else-if="productosFiltrados.length > 0" 
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductoCard 
          v-for="p in productosFiltrados" 
          :key="p.id" 
          :producto="p" 
          @ver-detalle="abrirDetalle"
          @editar="abrirEditar"
          @agregar-carrito="agregarAlCarrito" 
        />
      </div>

      <div v-else class="text-center py-24 bg-white/30 rounded-[3rem] border-2 border-dashed border-[#0e516c]/10">
        <div class="text-[#0e516c]/20 text-7xl mb-4 font-serif italic">Empty</div>
        <p class="text-[#0e516c]/60 font-serif text-xl italic mb-6">
          Aún no hay productos disponibles en esta sección.
        </p>
        <button 
          v-if="store.isAdmin" 
          @click="abrirNuevo" 
          class="text-[#0e516c] font-bold hover:underline"
        >
          Hacé clic aquí para cargar el primero
        </button>
      </div>
    </div>

    <Teleport to="body">
      <ProductModal 
        v-if="mostrarModal" 
        :productId="idActivo" 
        :modoAdmin="adminModo" 
        @close="cerrarModal" 
        @agregar="agregarAlCarrito"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from "@/stores/storeProduct";
import { useCarritoStore } from "@/stores/carrito";
import ProductoCard from "@/components/productoCard.vue";
import ProductModal from "@/components/ProductModal.vue";
import type { Producto } from "@/types/producto";

const store = useProductStore();
const carritoStore = useCarritoStore();

// Filtros (Siempre visibles y reactivos)
const busqueda = ref("");
const categoriaSeleccionada = ref("todas");
const ordenamiento = ref("relevancia");

// Modal
const mostrarModal = ref(false);
const idActivo = ref<number | null>(null);
const adminModo = ref(false);

// Lógica de Categorías dinámicas basada en lo que traiga la BD
const categorias = computed(() => {
  const catsFromStore = new Set(store.products.map(p => p.category));
  return ["todas", ...Array.from(catsFromStore)];
});

// Filtrado de productos (empieza vacío porque store.products es [])
const productosFiltrados = computed(() => {
  let res = [...store.products];
  
  if (busqueda.value) {
    res = res.filter(p => p.name.toLowerCase().includes(busqueda.value.toLowerCase()));
  }
  if (categoriaSeleccionada.value !== "todas") {
    res = res.filter(p => p.category === categoriaSeleccionada.value);
  }
  if (ordenamiento.value === "precio-asc") res.sort((a, b) => a.price - b.price);
  if (ordenamiento.value === "precio-desc") res.sort((a, b) => b.price - a.price);
  
  return res;
});

// ACCIONES
const abrirDetalle = (id: number) => {
  idActivo.value = id;
  adminModo.value = false;
  mostrarModal.value = true;
};

const abrirEditar = (p: Producto) => {
  idActivo.value = p.id;
  adminModo.value = true;
  mostrarModal.value = true;
};

const abrirNuevo = () => {
  idActivo.value = null;
  adminModo.value = true;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  idActivo.value = null;
};

const agregarAlCarrito = (producto: Producto) => {
  carritoStore.agregarProducto(producto, 1);
  carritoStore.abrirCarrito();
  if (mostrarModal.value) cerrarModal();
};

onMounted(() => store.fetchProducts());
</script>
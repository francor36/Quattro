<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ProductoCard from "@/components/productoCard.vue";
import type { Producto } from "@/types/producto";
import { useProductStore } from "@/stores/storeProduct";

const store = useProductStore();

// estados locales (se mantienen)
const busqueda = ref("");
const categoriaSeleccionada = ref<string>("todas");
const ordenamiento = ref<"relevancia" | "precio-asc" | "precio-desc" | "nombre">("relevancia");
const precioMin = ref<number>(0);
const precioMax = ref<number>(1000000);
const mostrarSoloStock = ref(false);

// alias para no romper nada abajo
const productos = computed(() => store.products);
const cargando = computed(() => store.loading);
const error = computed(() => store.error);


// categorías
const categorias = computed(() => {
  const cats = new Set(productos.value.map(p => p.category));
  return ["todas", ...Array.from(cats)];
});

// filtros (NO se toca)
const productosFiltrados = computed(() => {
  let resultado = [...productos.value];

  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(p =>
      p.name.toLowerCase().includes(termino) ||
      p.description?.toLowerCase().includes(termino)
    );
  }

  if (categoriaSeleccionada.value !== "todas") {
    resultado = resultado.filter(p => p.category === categoriaSeleccionada.value);
  }

  resultado = resultado.filter(p =>
    p.price >= precioMin.value && p.price <= precioMax.value
  );

  if (mostrarSoloStock.value) {
    resultado = resultado.filter(p => p.stock > 0);
  }

  switch (ordenamiento.value) {
    case "precio-asc":
      resultado.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      resultado.sort((a, b) => b.price - a.price);
      break;
    case "nombre":
      resultado.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return resultado;
});

const limpiarFiltros = () => {
  busqueda.value = "";
  categoriaSeleccionada.value = "todas";
  ordenamiento.value = "relevancia";
  precioMin.value = 0;
  precioMax.value = 1000000;
  mostrarSoloStock.value = false;
};

const verDetalle = (id: number) => {
  console.log("Ver detalle:", id);
};

const agregarCarrito = (producto: Producto) => {
  console.log("Agregar carrito:", producto);
};

onMounted(() => {
  store.fetchProducts();
});
</script>

<template>
  <div class="w-full py-12 px-4 font-serif" style="background-color: #fff1da;">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold mb-4" style="color: #0e516c">
          Nuestros Productos
        </h2>
        <p class="text-gray-600 text-lg">
          Descubre nuestra colección de guitarras y accesorios
        </p>
      </div>


      <div class="mb-8 bg-white rounded-lg shadow-md p-6" style="border: 2px solid #0e516c">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Búsqueda -->
          <div class="relative">
            <input v-model="busqueda" type="text" placeholder="Buscar productos..."
              class="w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2"
              style="border-color: #0e516c" />
            <svg class="absolute right-3 top-3 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="20"
              height="20" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>


          <select v-model="categoriaSeleccionada"
            class="px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 capitalize"
            style="border-color: #0e516c; color: #0e516c">
            <option v-for="cat in categorias" :key="cat" :value="cat" class="capitalize">
              {{ cat === 'todas' ? 'Todas las categorías' : cat }}
            </option>
          </select>


          <select v-model="ordenamiento" class="px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style="border-color: #0e516c; color: #0e516c">
            <option value="relevancia">Más relevantes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>

        <!-- Filtros adicionales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <!-- Precio mínimo -->
          <div>
            <label class="block text-sm font-semibold mb-1" style="color: #0e516c">
              Precio mínimo
            </label>
            <input v-model.number="precioMin" type="number" min="0" step="1000"
              class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
              style="border-color: #0e516c" />
          </div>

          <!-- Precio máximo -->
          <div>
            <label class="block text-sm font-semibold mb-1" style="color: #0e516c">
              Precio máximo
            </label>
            <input v-model.number="precioMax" type="number" min="0" step="1000"
              class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
              style="border-color: #0e516c" />
          </div>

          <div class="flex items-center justify-between gap-4">

            <button @click="limpiarFiltros" class="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
              style="background-color: #0e516c; color: #fff1da">
              Limpiar filtros
            </button>
          </div>
        </div>


        <div class="mt-4 pt-4 border-t" style="border-color: #0e516c">
          <p class="text-sm font-semibold" style="color: #0e516c">
            {{ productosFiltrados.length }} producto{{ productosFiltrados.length !== 1 ? 's' : '' }} encontrado{{
              productosFiltrados.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>


      <div v-if="cargando" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4" style="border-color: #0e516c"></div>
      </div>


      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-xl">{{ error }}</p>
        <button @click="store.fetchProducts()">

          Reintentar
        </button>
      </div>


      <div v-else-if="productosFiltrados.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductoCard v-for="producto in productosFiltrados" :key="producto.id" :producto="producto"
          @ver-detalle="verDetalle" @agregar-carrito="agregarCarrito" />
      </div>


      <div v-else class="text-center py-20">
        <svg class="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
          fill="none" stroke="#0e516c" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <p class="text-xl font-semibold mb-2" style="color: #0e516c">
          No se encontraron productos
        </p>
        <p class="text-gray-600 mb-4">
          Intenta ajustar los filtros de búsqueda
        </p>
        <button @click="limpiarFiltros" class="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
          style="background-color: #0e516c; color: #fff1da">
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>
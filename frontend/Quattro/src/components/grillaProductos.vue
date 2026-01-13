<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductoCard from './ProductoCard.vue';
import type { Producto } from '@/types/producto';

const productos = ref<Producto[]>([]);
const cargando = ref(true);
const error = ref<string | null>(null);

// Función para obtener productos desde el backend
const obtenerProductos = async () => {
  try {
    cargando.value = true;
    error.value = null;
    
    // TODO: Reemplazar con tu endpoint real
    // const response = await fetch('http://tu-backend.com/api/productos');
    // const data = await response.json();
    // productos.value = data;
    
    // Datos de ejemplo mientras no tengas el backend
    setTimeout(() => {
      productos.value = [
        {
          id: 1,
          titulo: 'Guitarra Eléctrica Stratocaster',
          precio: 250000,
          descripcion: 'Guitarra eléctrica con pastillas single coil',
          categoria: 'Guitarras Eléctricas',
          stock: 3
        },
        {
          id: 2,
          titulo: 'Guitarra Acústica Clásica',
          precio: 180000,
          descripcion: 'Guitarra acústica de cuerdas de nylon',
          categoria: 'Guitarras Acústicas',
          stock: 8
        },
        {
          id: 3,
          titulo: 'Amplificador Marshall 50W',
          precio: 320000,
          descripcion: 'Amplificador de válvulas para guitarra',
          categoria: 'Amplificadores',
          stock: 5
        },
        {
          id: 4,
          titulo: 'Pedal de Distorsión Boss DS-1',
          precio: 45000,
          descripcion: 'Pedal de efectos clásico',
          categoria: 'Pedales',
          stock: 15
        }
      ];
      cargando.value = false;
    }, 1000);
    
  } catch (err) {
    error.value = 'Error al cargar los productos';
    console.error(err);
    cargando.value = false;
  }
};

const verDetalle = (id: number) => {
  console.log('Ver detalle del producto:', id);
  // TODO: Navegar a la página de detalle
  // router.push(`/producto/${id}`);
};

const agregarCarrito = (producto: Producto) => {
  console.log('Agregar al carrito:', producto);
  // TODO: Implementar lógica del carrito
  alert(`${producto.titulo} agregado al carrito`);
};

onMounted(() => {
  obtenerProductos();
});
</script>

<template>
  <div class="w-full py-12 px-4 font-serif" style="background-color: #fff1da;">
    <div class="max-w-7xl mx-auto">
      <!-- Título de la sección -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4" style="color: #0e516c">
          Nuestros Productos
        </h2>
        <p class="text-gray-600 text-lg">
          Descubre nuestra colección de guitarras y accesorios
        </p>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4" style="border-color: #0e516c"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-xl">{{ error }}</p>
        <button 
          @click="obtenerProductos"
          class="mt-4 px-6 py-2 rounded-lg text-white"
          style="background-color: #0e516c"
        >
          Reintentar
        </button>
      </div>

      <!-- Grilla de productos -->
      <div 
        v-else-if="productos.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductoCard
          v-for="producto in productos"
          :key="producto.id"
          :producto="producto"
          @ver-detalle="verDetalle"
          @agregar-carrito="agregarCarrito"
        />
      </div>

      <!-- Sin productos -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600 text-xl">No hay productos disponibles</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/storeProduct';
import { useCarritoStore } from '@/stores/carrito';
import type { Producto } from '@/types/producto';

// Componentes Swiper y módulos
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

// Componentes
import ProductoCard from '@/components/productoCard.vue';

// Assets locales
import backgroundImage from '@/assets/parte-de-una-guitarra-acustica-diapason-de-guitarra-con-cuerdas-sobre-un-fondo-negro.jpg';
import prodImage from '@/assets/image.png'; // Tu foto original
import imgGuitarras from '@/assets/guitarras.png';
import imgRemeras from '@/assets/remeras.png';
import imgTienda from '@/assets/parte-de-una-guitarra-acustica-diapason-de-guitarra-con-cuerdas-sobre-un-fondo-negro.jpg';

// Lista de fotos: La primera es tu foto original
const heroImages = [
  prodImage, 
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
];

const artistas = [
  "https://cdn-images.dzcdn.net/images/cover/bb4591a4c56f889dc093bba9512ed1eb/0x1900-000000-80-0-0.jpg",
  "https://i.pinimg.com/736x/aa/30/e0/aa30e093b67371c4896134efb8bea80f.jpg",
  "https://cdn-images.dzcdn.net/images/cover/58d51f8c09eadbb895e76c9961461279/0x1900-000000-80-0-0.jpg",
  "https://indiosolarioficial.com/images/logo.png",
  "https://i.pinimg.com/originals/6f/1f/f3/6f1ff38319cdba6730fc2bfb3ca8bd96.jpg"
];

const store = useProductStore();
const carritoStore = useCarritoStore();

const sections = [
  { title: 'Guitarras', desc: 'Explora nuestra colección de guitarras.', image: imgGuitarras, to: '/productos' },
  { title: 'Accesorios', desc: 'Cuerdas, afinadores y todo lo que necesitas.', image: imgRemeras, to: '/productos' },
  { title: 'Nosotros', desc: 'Conoce nuestra historia y pasión.', image: imgTienda, to: '/nosotros' }
];

const productosDestacados = computed(() => store.products.slice(0, 4));

const agregarCarrito = (producto: Producto) => {
  if (carritoStore.agregarProducto(producto, 1)) {
    carritoStore.abrirCarrito();
  }
};

onMounted(() => {
  store.fetchProducts();
});
</script>

<template>
  <div class="bg-[#fff1da] min-h-screen">
    
    <section id="welcome" class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
      <div class="absolute inset-0 bg-[#0e516c]/20"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#fff1da]">Bienvenido a Quattro</h1>
            <p class="text-lg md:text-xl font-serif mb-8 text-[#fff1da]">Guitarras al mejor precio del Alto Valle</p>
            <button @click="$emit('view-more')" class="px-8 py-4 font-serif text-lg font-semibold rounded-lg bg-[#fff1da] text-[#0e516c] hover:scale-105 transition-all duration-300">
              Ver Catálogo →
            </button>
          </div>
          
          <div class="lg:w-1/2 w-full max-w-sm mx-auto group">
            <swiper
              :modules="[Autoplay, EffectFade, Pagination, Navigation]"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{ delay: 4500, disableOnInteraction: false }"
              :pagination="{ clickable: true }"
              :navigation="true"
              effect="fade"
              class="rounded-2xl shadow-2xl overflow-hidden aspect-[4/5]"
            >
              <swiper-slide v-for="(img, index) in heroImages" :key="index">
                <img 
                  :src="img" 
                  alt="Imagen Quattro" 
                  class="w-full h-full object-cover" 
                />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 bg-[#fff1da]">
      <div class="container mx-auto">
        <h2 class="text-4xl font-serif font-bold text-center text-[#0e516c] mb-12">Productos Destacados</h2>
        <div v-if="store.loading" class="text-center py-10 text-[#0e516c]">Cargando destacados...</div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductoCard 
            v-for="producto in productosDestacados" 
            :key="producto.id" 
            :producto="producto" 
            @agregar-carrito="agregarCarrito"
          />
        </div>
      </div>
    </section>

    <section class="py-10 overflow-hidden bg-[#fff1da]">
      <div class="fade-mask flex gap-8">
        <div class="animate-marquee flex gap-8 min-w-full">
          <img 
            v-for="(img, index) in [...artistas, ...artistas, ...artistas]" 
            :key="index"
            :src="img" 
            alt="Artista" 
            class="h-40 w-40 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer hover:scale-105"
          />
        </div>
      </div>
    </section>

    <section class="py-16 px-4 bg-[#fff1da]">
      <div class="container mx-auto">
        <h2 class="text-4xl font-serif font-bold text-center text-[#0e516c] mb-12">Descubre Quattro</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <router-link
            v-for="item in sections"
            :key="item.title"
            :to="item.to"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
          >
            <div class="relative h-64 overflow-hidden">
              <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-serif font-bold text-gray-800 mb-3">{{ item.title }}</h3>
              <p class="text-gray-600 mb-4">{{ item.desc }}</p>
              <div class="flex items-center text-[#0e516c] font-semibold">Ver productos →</div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilos para el Marquee */
.fade-mask {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
.animate-marquee {
  animation: scroll 30s linear infinite;
}
@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-33.33%); }
}

/* --- NUEVOS ESTILOS PARA LAS FLECHAS MINIMALISTAS --- */

/* Base de las flechas: Sin fondo y color azul de la marca */
:deep(.swiper-button-next), 
:deep(.swiper-button-prev) {
  color: #0e516c !important; /* Azul de tu marca */
  background: transparent !important; /* Sin fondo circular */
  width: 40px !important;
  height: 40px !important;
  opacity: 0; /* Ocultas por defecto */
  transition: all 0.4s ease-in-out;
  transform: translateY(-50%) scale(0.8); /* Un poco más pequeñas y centradas */
}

/* Mostramos las flechas cuando pasamos el mouse sobre el contenedor (gracias a 'group') */
.group:hover :deep(.swiper-button-next),
.group:hover :deep(.swiper-button-prev) {
  opacity: 1; /* Aparecen */
  transform: translateY(-50%) scale(1); /* Toman su tamaño normal */
}

/* Hacemos la flecha un poco más gruesa y grande */
:deep(.swiper-button-next::after), 
:deep(.swiper-button-prev::after) {
  font-size: 24px !important;
  font-weight: 900;
}

/* Efecto hover suave solo sobre la flecha */
:deep(.swiper-button-next:hover), 
:deep(.swiper-button-prev:hover) {
  transform: translateY(-50%) scale(1.15) !important;
}

/* Ajuste de los puntitos de paginación para que combinen */
:deep(.swiper-pagination-bullet-active) {
  background-color: #0e516c !important; /* Azul para la paginación activa */
}
:deep(.swiper-pagination-bullet) {
  background-color: #0e516c; /* Azul con opacidad para las inactivas */
  opacity: 0.3;
}
</style>
<template>
  <section id="welcome" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
    
   
    <div class="absolute inset-0 bg-[#0e516c]/20"></div>
    
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        
        <div class="lg:w-1/2 text-left">
          <div class="max-w-2xl">
            <h1 
              v-if="title"
              class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
              :style="{ color: '#fff1da' }"
            >
              {{ title }}
            </h1>
            
            <p 
              v-if="description"
              class="text-lg md:text-xl font-serif mb-8 leading-relaxed"
              :style="{ color: '#fff1da' }"
            >
              {{ description }}
            </p>
            
            <button
              @click="handleClick"
              class="px-8 py-4 font-serif text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fff1da]/50"
              :style="{ 
                backgroundColor: '#fff1da',
                color: '#0e516c'
              }"
            >
              {{ buttonText }}
              <span class="ml-2">→</span>
            </button>
          </div>
        </div>
        
        <!-- Columna derecha - Imagen -->
        <div class="lg:w-1/2">
          <div class="relative">
            <img 
              :src="contentImage"
              :alt="imageAlt"
              class="rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Flecha indicadora scroll -->
    <div 
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <svg 
        class="w-8 h-8"
        :style="{ color: '#fff1da' }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
      </svg>
    </div>
  </section>
  <section class="py-16 px-4 bg-[#fff1da]">
    <div class="container mx-auto">
      <h2 class="text-4xl font-serif font-bold text-center text-[#0e516c] mb-12">
        Descubre Quattro
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        <!-- Card 1: Guitarras -->
        <router-link 
          to="productos" 
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
        >
          <div class="relative h-64 overflow-hidden">
            <img 
              src="../assets/guitarras.png"
              alt="Guitarras acústicas"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            <div 
              class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold bg-[#0e516c] text-white"
            >
              Ver catálogo
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-[#0e516c]/10 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-[#0e516c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-gray-800">Guitarras</h3>
            </div>
            <p class="text-gray-600 mb-4">
              Explora nuestra colección de guitarras eléctricas, acústicas y clásicas. Las mejores marcas al mejor precio.
            </p>
            <div class="flex items-center text-[#0e516c] font-semibold">
              <span>Ver productos</span>
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
        </router-link>

        <!-- Card 2: Accesorios -->
        <router-link 
          to="/productos" 
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
        >
          <div class="relative h-64 overflow-hidden">
            <img 
              src="../assets/remeras.png"
              alt="Accesorios musicales"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            <div 
              class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold bg-[#0e516c] text-white"
            >
              Ver catálogo
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-[#0e516c]/10 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-[#0e516c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-gray-800">Accesorios</h3>
            </div>
            <p class="text-gray-600 mb-4">
              Todo lo que necesitas: cuerdas, afinadores, puas, correas, estuches y más para complementar tu equipo.
            </p>
            <div class="flex items-center text-[#0e516c] font-semibold">
              <span>Ver productos</span>
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
        </router-link>

        <!-- Card 3: Nosotros -->
        <router-link 
          to="/nosotros" 
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
        >
          <div class="relative h-64 overflow-hidden">
            <img 
              src="../assets/parte-de-una-guitarra-acustica-diapason-de-guitarra-con-cuerdas-sobre-un-fondo-negro.jpg"
              alt="Nuestra tienda y equipo"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            <div 
              class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold bg-[#0e516c] text-white"
            >
              Conócenos
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-[#0e516c]/10 flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-[#0e516c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-serif font-bold text-gray-800">Nosotros</h3>
            </div>
            <p class="text-gray-600 mb-4">
              Conoce nuestra historia, nuestro equipo y nuestra pasión por la música. Más de 10 años acompañando músicos.
            </p>
            <div class="flex items-center text-[#0e516c] font-semibold">
              <span>Saber más</span>
              <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import localBackgroundImage from '@/assets/parte-de-una-guitarra-acustica-diapason-de-guitarra-con-cuerdas-sobre-un-fondo-negro.jpg'
import prodImage from '@/assets/image.png'
// Props configurables
const props = defineProps({
  title: {
    type: String,
    default: 'Bienvenido a Quattro'
  },
  description: {
    type: String,
    default: 'Guitarras al mejor precio del Alto Valle'
  },
  buttonText: {
    type: String,
    default: 'Ver Más'
  },
  backgroundImage: {
    type: String,
    default: localBackgroundImage
  },
  contentImage: {
    type: String,
    default: prodImage
  },
  imageAlt: {
    type: String,
    default: 'Productos destacados de la tienda'
  },
  showScrollIndicator: {
    type: Boolean,
    default: true
  }
})

// Emit para el evento del botón
const emit = defineEmits(['view-more'])

// Manejar click del botón
const handleClick = () => {
  emit('view-more')
  // También puedes agregar navegación o lógica adicional aquí
  console.log('Navegando a productos...')
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la tipografía serif */
.font-serif {
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* Animación personalizada para el botón */
button {
  box-shadow: 0 4px 6px -1px rgba(14, 81, 108, 0.2);
}

button:hover {
  box-shadow: 0 10px 15px -3px rgba(14, 81, 108, 0.3);
}

/* Responsive adicional */
@media (max-width: 768px) {
  #welcome {
    min-height: 90vh;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}
</style>
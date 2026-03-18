<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCarritoStore } from '@/stores/carrito';
import CarritoIcono from './carritoIcono.vue';
import LoginRegistroModal from './Login.vue';
import CarritoSlide from './CarritoSlide.vue';

// Importación del logo
import logoImg from '../assets/Imagen de WhatsApp 2025-09-05 a las 22.42.53_5e24845e.jpg';

const authStore = useAuthStore();
const carritoStore = useCarritoStore();
const mostrarLogin = ref(false);
const menuAbierto = ref(false);

const abrirLogin = () => { mostrarLogin.value = true; };
const cerrarLogin = () => { mostrarLogin.value = false; };
const handleLogout = () => { authStore.logout(); };

onMounted(() => {
  authStore.cargarSesion();
});
</script>

<template>
  <div class="w-full bg-[#0e516c] p-4 font-serif">
    <div class="flex items-center justify-between">
      
      <div class="flex shrink-0 items-center max-w-28 pl-10">
        <img :src="logoImg" alt="QuattroLogo" class="max-w-full h-auto">
      </div>

      <nav class="hidden md:flex items-center space-x-2">
        <router-link to="/" class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl" active-class="text-[#ffcc00]">Inicio</router-link>
        <router-link to="/productos" class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl" active-class="text-[#ffcc00]">Productos</router-link>
        
        <router-link v-if="authStore.esAdmin" to="/admin" class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl" active-class="text-[#ffcc00]">Panel Admin</router-link>
        
        <router-link to="/nosotros" class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl" active-class="text-[#ffcc00]">Nosotros</router-link>
        <router-link to="/contacto" class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl" active-class="text-[#ffcc00]">Contacto</router-link>

        <CarritoIcono />

        <div class="pr-10">
            <button v-if="!authStore.estaAutenticado" @click="abrirLogin" class="flex items-center gap-2 bg-[#fff1da] text-[#0e516c] hover:bg-[#0e516c] hover:text-[#fff1da] font-bold transition-all duration-200 rounded-full px-6 py-3 border-2 border-[#fff1da]">
                Ingresar
            </button>
            <button v-else @click="handleLogout" class="flex items-center gap-2 bg-[#fff1da] text-[#0e516c] hover:bg-red-600 hover:text-white font-bold transition-all duration-200 rounded-full px-6 py-3 border-2 border-[#fff1da]">
                Salir
            </button>
        </div>
      </nav>

      <div class="md:hidden flex items-center gap-4 pr-10">
        <CarritoIcono />
        <button @click="menuAbierto = !menuAbierto" class="text-[#fff1da]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </div>

    <div v-if="menuAbierto" class="md:hidden flex flex-col items-center py-4 space-y-4">
      <router-link to="/" class="text-[#fff1da] text-xl font-bold" @click="menuAbierto = false">Inicio</router-link>
      <router-link to="/productos" class="text-[#fff1da] text-xl font-bold" @click="menuAbierto = false">Productos</router-link>
      <router-link v-if="authStore.esAdmin" to="/admin" class="text-[#fff1da] text-xl font-bold" @click="menuAbierto = false">Panel Admin</router-link>
      <router-link to="/nosotros" class="text-[#fff1da] text-xl font-bold" @click="menuAbierto = false">Nosotros</router-link>
      <router-link to="/contacto" class="text-[#fff1da] text-xl font-bold" @click="menuAbierto = false">Contacto</router-link>
      
      <button @click="authStore.estaAutenticado ? handleLogout() : abrirLogin(); menuAbierto = false" class="text-[#fff1da] text-xl font-bold">
        {{ authStore.estaAutenticado ? 'Salir' : 'Ingresar' }}
      </button>
    </div>
  </div>

  <LoginRegistroModal :mostrar="mostrarLogin" @cerrar="cerrarLogin" />
  <CarritoSlide /> 
</template>
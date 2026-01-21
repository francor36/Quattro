<script setup lang="ts">
import { ref } from 'vue';

const usuarioLogueado = ref(false);
const nombreUsuario = ref('');

const handleLogin = () => {
  // TODO: Implementar lógica de login
  console.log('Abrir modal de login');
  // router.push('/login');
};

const handleLogout = () => {
  usuarioLogueado.value = false;
  nombreUsuario.value = '';
  console.log('Usuario deslogueado');
};
</script>

<template>
    <div class="w-full flex items-center justify-between bg-[#0e516c] p-4 font-serif">

        <div class="flex shrink-0 items-center max-w-28 pl-10">
            <img 
                src="../assets/Imagen de WhatsApp 2025-09-05 a las 22.42.53_5e24845e.jpg" 
                alt="QuattroLogo"
                class="max-w-full h-auto"
            >
        </div>

        <!-- Menú de navegación -->
        <nav class="flex items-center space-x-6">
            <router-link 
                to="/" 
                class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl"
                active-class="text-[#ffcc00]"
            >
                Inicio
            </router-link>
            
            <router-link 
                to="/productos" 
                class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl"
                active-class="text-[#ffcc00]"
            >
                Productos
            </router-link>
            
            <router-link 
                to="/nosotros" 
                class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl"
                active-class="text-[#ffcc00]"
            >
                Nosotros
            </router-link>
            
            <router-link 
                to="/contacto" 
                class="text-[#fff1da] hover:bg-[#fff1da] hover:text-[#0e516c] font-bold transition-colors duration-200 rounded-4xl p-4 text-xl"
                active-class="text-[#ffcc00]"
            >
                Contacto
            </router-link>

            <!-- Botón de Login / Usuario -->
            <div v-if="!usuarioLogueado" class="pr-10">
                <button 
                    @click="handleLogin"
                    class="flex items-center gap-2 bg-[#fff1da] text-[#0e516c] hover:bg-[#0e516c] hover:text-[#fff1da] font-bold transition-all duration-200 rounded-full px-6 py-3 border-2 border-[#fff1da]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Ingresar
                </button>
            </div>

            <div v-else class="relative pr-10">
                <button 
                    class="flex items-center gap-2 bg-[#fff1da] text-[#0e516c] hover:bg-[#0e516c] hover:text-[#fff1da] font-bold transition-all duration-200 rounded-full px-6 py-3 border-2 border-[#fff1da]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{{ nombreUsuario || 'Usuario' }}</span>
                </button>
            </div>
        </nav>
    </div>
</template>
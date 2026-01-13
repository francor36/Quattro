<script setup lang="ts">


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

            <button class="">

            </button>
        </nav>
    </div>
</template>

<script>

</script>
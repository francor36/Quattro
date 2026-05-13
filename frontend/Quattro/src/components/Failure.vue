<template>
  <div class="min-h-screen font-serif py-12 px-4" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center shadow-2xl border-8 border-white bg-white/50" 
             style="border-color: #dc2626">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 class="text-5xl md:text-7xl font-black mb-6 text-gray-900 leading-tight">
          PAGO NO COMPLETADO
        </h1>
        <p class="text-2xl text-gray-700 font-semibold">No te preocupes, podés intentarlo nuevamente</p>
      </div>

      <!-- Detalles del error -->
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-red-200 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">¿Qué pasó?</h2>
        
        <div class="space-y-4 mb-8">
          <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <h3 class="font-bold text-lg text-red-800 mb-3">Motivo del error:</h3>
            <p class="text-red-700 leading-relaxed">{{ errorMessage }}</p>
          </div>
          <div class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h3 class="font-bold text-lg text-yellow-800 mb-3">¡Buenas noticias!</h3>
            <ul class="text-yellow-700 space-y-1">
              <li>• Tu carrito sigue intacto ✅</li>
              <li>• No se te cobró nada ✅</li>
              <li>• Podés pagar cuando quieras ✅</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-col lg:flex-row gap-6 justify-center max-w-3xl mx-auto mb-12">
        <router-link
          to="/checkout"
          class="group flex-1 py-6 px-10 rounded-3xl font-bold text-xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4 text-center h-20"
          style="background: linear-gradient(135deg, #0e516c 0%, #1e6b8a 50%, #0e516c 100%)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="9,12 12,15 20,8"/>
          </svg>
          Intentar pagar ahora
        </router-link>

        <router-link
          to="/carrito"
          class="group flex-1 py-6 px-10 rounded-3xl font-bold text-xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4 text-center h-20 border-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 12h4l3 6h10l4-8-4-4H7l-3 6"/>
          </svg>
          Revisar mi carrito
        </router-link>
      </div>

      <!-- Soporte -->
      <div class="text-center max-w-2xl mx-auto">
        <p class="text-xl font-bold text-gray-800 mb-4">¿Necesitás ayuda?</p>
        <p class="text-lg text-gray-600 mb-6">Escribinos a <a href="mailto:soporte@tuproyecto.com" class="font-bold underline hover:text-blue-600">soporte@tuproyecto.com</a></p>
        <div class="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 rounded-full text-blue-800 font-semibold">
          💬 WhatsApp: <span class="font-black">+54 11 1234-5678</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMessage = ref('');

onMounted(() => {
  errorMessage.value = (route.query.error as string) || 
                       (route.query.message as string) || 
                       'Hubo un problema con el pago';
});
</script>
<script setup lang="ts">
</script>

<template>
  <footer class="w-full font-serif" style="background-color: #0e516c" >
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo y Descripción -->
        <div class="col-span-1 md:col-span-1">
          <div class="w-32 h-32 rounded-lg flex items-center justify-center mb-4" style="background-color: #fff1da">
            <span class="text-4xl font-bold" style="color: #0e516c">
               <img 
                src="../assets/Imagen de WhatsApp 2025-09-05 a las 22.42.53_5e24845e.jpg" 
                alt="QuattroLogo"
                class="max-w-full h-auto"
            >
            </span>
          </div>
          <p class="text-sm" style="color: #fff1da">
            Tu destino para las mejores guitarras y accesorios.
          </p>
        </div>

        <!-- Enlaces Rápidos -->
        <div>
          <h3 class="text-lg font-bold mb-4" style="color: #fff1da">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm hover:underline transition-all" style="color: #fff1da">Inicio</a></li>
            <li><a href="#" class="text-sm hover:underline transition-all" style="color: #fff1da">Guitarras</a></li>
            <li><a href="#" class="text-sm hover:underline transition-all" style="color: #fff1da">Accesorios</a></li>
            <li><a href="#" class="text-sm hover:underline transition-all" style="color: #fff1da">Nosotros</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4" style="color: #fff1da">Contacto</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff1da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span class="text-sm" style="color: #fff1da">Quattroguitarrasok@gmail.com</span>
            </li>
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff1da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span class="text-sm" style="color: #fff1da">299-6564429</span>
            </li>
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff1da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span class="text-sm" style="color: #fff1da">Balcarce & ingeniero pagano</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4" style="color: #fff1da">Síguenos</h3>
          <div class="flex gap-4">
            <a href="https://www.facebook.com/quattroguitarrasok/?ref=_xav_ig_profile_page_web#" class="p-2 rounded-full transition-all hover:scale-110" style="background-color: #fff1da">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/quattroguitarras/" class="p-2 rounded-full transition-all hover:scale-110" style="background-color: #fff1da">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            
          </div>
          <p class="text-sm mt-6" style="color: #fff1da">
            Suscríbete a nuestro newsletter para ofertas exclusivas
          </p>
          <input 
            type="email" 
            placeholder="Tu email" 
            class="w-full mt-3 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
            style="background-color: #fff1da; color: #0e516c"
          />
        </div>
      </div>

      <div class="border-t mt-8 pt-6" style="border-color: #fff1da">
        <p class="text-center text-sm" style="color: #fff1da">
          © 2026 Quatro Guitarras. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
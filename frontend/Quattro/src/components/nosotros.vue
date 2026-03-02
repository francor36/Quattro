<template>
  <div class="relative min-h-screen bg-[#fff1da] py-20 px-6 overflow-hidden">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0e516c]/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0e516c]/5 rounded-full blur-[120px]"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      
      <div class="text-center mb-20">
        <h1 class="text-5xl md:text-7xl font-bold text-[#0e516c] mb-6 tracking-tight">
          Sobre Nosotros
        </h1>
        <div class="h-1.5 w-24 bg-[#0e516c] mx-auto rounded-full"></div>
      </div>

      <div class="space-y-8">
        
        <div class="bg-white/40 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-[#0e516c] rounded-2xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 class="text-3xl font-bold text-[#0e516c]">La historia de Quattro</h2>
          </div>
          <div class="space-y-4 text-lg text-[#0e516c]/80 leading-relaxed">
            <p>Somos dos amigos que decidieron emprender juntos, unidos no solo por una amistad de años, sino también por una pasión en común: la música y las guitarras.</p>
            <p>Quattro nació como un sueño compartido entre cuatro amigos. Aunque hoy el proyecto lo llevamos adelante dos de nosotros, los lazos permanecen intactos: la amistad, el respeto y la familia son el corazón de lo que hacemos.</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm">
            <h3 class="text-xl font-bold text-[#0e516c] mb-4">Nuestra Esencia</h3>
            <p class="text-[#0e516c]/80 leading-relaxed">
              Cada instrumento refleja lo que somos: calidad y dedicación. No vendemos solo guitarras, acompañamos a cada músico a encontrar su voz para ensayos, shows y momentos especiales.
            </p>
          </div>
          <div class="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm">
            <h3 class="text-xl font-bold text-[#0e516c] mb-4">Nuestro Camino</h3>
            <p class="text-[#0e516c]/80 leading-relaxed">
              Viajes, escenarios y charlas interminables. La música marcó nuestro camino, transformando nuestra amistad en familia. Quattro es el resultado de esa unión.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div v-for="(val, i) in ['Amistad', 'Pasión', 'Calidad']" :key="i" 
               class="bg-white/60 p-6 rounded-2xl text-center border border-white/50 shadow-sm hover:shadow-md transition-all">
            <p class="text-2xl font-bold text-[#0e516c]">{{ val }}</p>
            <p class="text-sm text-[#0e516c]/60 mt-2 uppercase tracking-widest font-bold">Valor base</p>
          </div>
        </div>

        <div class="pt-16 pb-8 text-center">
            <img 
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200&auto=format&fit=crop" 
                alt="Amigos tocando guitarra en Quattro" 
                class="rounded-3xl shadow-lg border border-white/50 w-full max-w-2xl mx-auto object-cover h-80 transition-transform hover:scale-[1.01]"
            />
        </div>

        <div class="text-center pt-8">
          <p class="text-xl text-[#0e516c] mb-10 italic">"No vendemos solo guitarras, compartimos una forma de sentir la música"</p>
          <router-link 
            to="/productos"
            class="inline-block px-10 py-5 rounded-2xl font-bold text-lg text-[#fff1da] transition-all hover:scale-[1.02] bg-[#0e516c] hover:shadow-xl shadow-lg"
          >
            Ver catálogo de productos
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>
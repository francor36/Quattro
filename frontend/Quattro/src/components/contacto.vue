<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  nombre: '',
  email: '',
  mensaje: '',
})

const enviarFormulario = () => {
  alert('¡Gracias por tu mensaje, ' + form.value.nombre + '! Nos pondremos en contacto pronto.')
  form.value = { nombre: '', email: '', mensaje: '' }
}
</script>

<template>
  <div class="bg-[#fff1da] min-h-screen p-6 md:p-12 font-serif">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-bold text-[#0e516c] mb-10 text-center">Contáctanos</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div class="bg-white p-8 rounded-2xl shadow-xl border border-[#0e516c]/10">
          <form @submit.prevent="enviarFormulario" class="space-y-6">
            <div>
              <label class="block text-[#0e516c] font-bold mb-2">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#0e516c] outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-[#0e516c] font-bold mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#0e516c] outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-[#0e516c] font-bold mb-2">Mensaje</label>
              <textarea
                v-model="form.mensaje"
                rows="4"
                required
                class="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#0e516c] outline-none transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full bg-[#0e516c] text-[#fff1da] py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all text-lg"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

        <div
          class="overflow-hidden rounded-2xl shadow-xl h-[450px] w-full border-4 border-white bg-white"
        >
          <div class="flex items-center justify-center h-full text-[#0e516c]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.63588267232!2d-67.99401882430034!3d-38.93297090558778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a324905187e19%3A0x6442654d4554868f!2sPagnano%20Ing.%20881%2C%20Cipolletti%2C%20R%C3%ADo%20Negro!5e0!3m2!1ses-419!2sar!4v1709400000000!5m2!1ses-419!2sar"
              width="100%"
              height="450"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
            >
            </iframe>
          </div>
        </div>
      </div>

      <div class="text-center mt-10 border-t-2 border-[#0e516c]/20 pt-10">
        <blockquote class="text-3xl md:text-4xl font-extrabold text-[#0e516c] leading-tight italic">
          "Poder decir adiós, es crecer."
        </blockquote>
        <p class="text-[#0e516c] font-bold mt-4 text-xl">— Gustavo Cerati</p>
      </div>
    </div>
  </div>
</template>
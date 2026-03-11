<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
    <div class="absolute inset-0 bg-[#0e516c]/60 backdrop-blur-xl transition-opacity" @click="$emit('close')"></div>
    
    <div class="relative bg-[#fff1da] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/30 flex flex-col md:flex-row min-h-[500px] animate-modal-in">
      
      <button @click="$emit('close')" class="absolute top-6 right-6 z-50 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:rotate-90 text-[#0e516c]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div class="w-full md:w-1/2 bg-white/50 p-8 flex items-center justify-center relative">
        <div class="absolute top-8 left-8">
          <span class="bg-[#0e516c] text-[#fff1da] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{{ form.category || 'Nuevo' }}</span>
        </div>
        <img :src="form.image" class="relative max-h-[350px] w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-110" />
      </div>

      <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-transparent to-[#0e516c]/5">
        
        <div v-if="permitirEdicion" class="space-y-4">
          <h2 class="text-3xl font-serif font-bold text-[#0e516c] mb-4">Gestionar Producto</h2>
          <input v-model="form.name" type="text" placeholder="Nombre" class="w-full bg-white/80 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#0e516c]">
          <div class="grid grid-cols-2 gap-4">
            <input v-model.number="form.price" type="number" placeholder="Precio" class="w-full bg-white/80 p-4 rounded-2xl outline-none">
            <input v-model="form.category" type="text" placeholder="Categoría" class="w-full bg-white/80 p-4 rounded-2xl outline-none">
          </div>
          <input v-model="form.image" type="text" placeholder="URL Imagen" class="w-full bg-white/80 p-4 rounded-2xl outline-none">
          <textarea v-model="form.description" rows="3" placeholder="Descripción" class="w-full bg-white/80 p-4 rounded-2xl outline-none resize-none"></textarea>
          <button @click="ejecutarGuardar" class="w-full bg-[#0e516c] text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:brightness-110 transition-all">
            {{ esNuevo ? 'Publicar Ahora' : 'Guardar Cambios' }}
          </button>
        </div>

        <div v-else class="flex flex-col h-full justify-between">
          <div>
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#0e516c] mb-4">{{ form.name }}</h1>
            <p class="text-[#0e516c]/70 text-lg font-light mb-8">{{ form.description }}</p>
          </div>
          <div class="flex flex-col gap-6">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-bold text-[#0e516c]/40 uppercase tracking-tighter">Precio</span>
              <span class="text-5xl font-bold text-[#0e516c]">${{ form.price }}</span>
            </div>
            <button @click="$emit('agregar', form)" class="w-full bg-[#0e516c] text-[#fff1da] py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl hover:gap-5 transition-all">
              <span>Añadir al Carrito</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useProductStore } from "@/stores/storeProduct";

const props = defineProps<{ productId: number | null, modoAdmin: boolean }>();
const emit = defineEmits(['close', 'agregar']);
const store = useProductStore();

const esNuevo = computed(() => props.productId === null);
const permitirEdicion = computed(() => store.isAdmin && (props.modoAdmin || esNuevo.value));

const form = reactive({
  name: '', price: 0, category: '', description: '', 
  image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
});

onMounted(() => {
  if (props.productId !== null) {
    const p = store.products.find(item => item.id === props.productId);
    if (p) Object.assign(form, JSON.parse(JSON.stringify(p)));
  }
});

const ejecutarGuardar = async () => {
  if (esNuevo.value) {
    await store.addProduct({ ...form });
  } else {
    await store.updateProduct(props.productId!, { ...form });
  }
  emit('close');
};
</script>

<style scoped>
@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-modal-in { animation: modalIn 0.3s ease-out forwards; }
</style>
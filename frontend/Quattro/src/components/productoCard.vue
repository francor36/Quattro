<script setup lang="ts">
import { computed } from "vue";
import type { Producto } from "@/types/producto";

const props = defineProps<{
  producto: Producto;
}>();

// Computed para la URL de la imagen
const imageUrl = computed(() => {
  return props.producto.image
    ? `http://localhost:3000/uploads/${props.producto.image}`
    : "/img/no-image.png";
});


</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <img
      :src="imageUrl"
      class="w-full h-48 object-cover rounded"
      alt="producto"
    />

    <h3 class="mt-2 font-bold text-lg">
      {{ props.producto.name }}
    </h3>

    <p class="text-sm text-gray-600">
      {{ props.producto.description }}
    </p>

    <p class="mt-2 font-semibold text-green-700">
      ${{ props.producto.price }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import socket from "../plugins/socket";

const notificaciones = ref([]);

onMounted(() => {
  // 🔔 Evento: producto cargado
  socket.on("producto:cargado", (data) => {
    notificaciones.value.push(`🛒 ${data.mensaje}`);
  });

  // 🔔 Evento: usuario inició sesión
  socket.on("usuario:inicio", (data) => {
    notificaciones.value.push(`👤 ${data.mensaje}`);
  });
});

onUnmounted(() => {
  socket.off("producto:cargado");
  socket.off("usuario:inicio");
});
</script>

<template>
  <div class="p-4 bg-gray-100 rounded-lg shadow">
    <h2 class="text-lg font-bold mb-2">Notificaciones</h2>
    <ul>
      <li v-for="(n, i) in notificaciones" :key="i">{{ n }}</li>
    </ul>
  </div>
</template>

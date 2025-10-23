<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { io } from "socket.io-client";

// 🔌 Conectamos con el backend
const socket = io("http://localhost:3000"); // cambia si tu backend corre en otro puerto
const notificaciones = ref<string[]>([]);

// 🔔 Escuchamos eventos
onMounted(() => {
  socket.on("producto:cargado", (data) => {
    notificaciones.value.push(`🛒 ${data.mensaje}`);
  });

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
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
  <!-- 🔔 Panel de notificaciones -->
  <div
    v-if="notificaciones.length"
    class="notificaciones"
  >
    <h3 class="titulo">Notificaciones</h3>
    <ul>
      <li v-for="(n, i) in notificaciones" :key="i">{{ n }}</li>
    </ul>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
/* 💬 Panel flotante de notificaciones */
.notificaciones {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 280px;
  max-height: 220px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.notificaciones .titulo {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>

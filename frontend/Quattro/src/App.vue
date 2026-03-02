<template>
  <div class="app-container">
    <RouterView /> <carritoslide />
  </div>
</template>

<style>
/* Reset básico para que no haya scroll horizontal feo */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}
</style>
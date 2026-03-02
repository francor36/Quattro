<script setup lang="ts">
import navbar from '@/components/navbar.vue';
import PieDePagina from '@/components/pieDePagina.vue';


</script>
<template>
    <div class="w-full min-h-screen flex-col bg-zinc-900 text-zinc-200 font-sans">
        <!-- Sidebar -->
        <header>
            <navbar></navbar>
        </header>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col">
            <!-- Content Area -->
            <section class="flex-1 overflow-y-auto bg-zinc-900">
                <RouterView />
            </section>
        </main>
        <footer>
            <PieDePagina></PieDePagina>
        </footer>
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useCarritoStore } from '@/stores/carrito';
import { useAuthStore } from '@/stores/auth';
import LoginComponent from '@/components/Login.vue';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();

const showLogin = ref(false);
const paso = ref<'formulario' | 'procesando' | 'error'>('formulario');
const error = ref('');

const formatoPrecio = (precio: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

const BASE_URL = 'http://localhost:3000';

const handlePagarClick = () => {
  if (!authStore.token) {
    showLogin.value = true;
  } else {
    confirmarCompra();
  }
};

const confirmarCompra = async () => {
  paso.value = 'procesando';
  error.value = '';

  try {
    const resOrden = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify({
        nombre_cliente: authStore.usuario?.nombre || 'Cliente',
        email_cliente: authStore.usuario?.email || '',
        items: carritoStore.items.map(i => ({ product_id: i.producto.id, quantity: i.cantidad, unit_price: i.producto.price })),
        total_amount: carritoStore.precioTotal,
      }),
    });

    const dataOrden = await resOrden.json();
    if (!dataOrden.ok) throw new Error('Error al crear orden');

    const resMP = await fetch(`${BASE_URL}/api/payments/mp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: dataOrden.order_id }), 
    });

    const dataMP = await resMP.json();
    window.location.href = dataMP.init_point;

  } catch (err: any) {
    paso.value = 'error';
    error.value = 'Ocurrió un error al procesar.';
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#fff1da] py-6 px-4 md:py-12 flex justify-center items-start md:items-center">
    
    <LoginComponent :mostrar="showLogin" @cerrar="showLogin = false" />

    <div class="w-full max-w-lg">
      
      <h1 class="text-3xl md:text-4xl font-serif font-bold text-[#0e516c] text-center mb-6 md:mb-10">Finalizar Compra</h1>

      <div class="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 border border-[#0e516c]/10">
        <h2 class="text-xl md:text-2xl font-bold text-[#0e516c] mb-6 text-center">Tu Pedido</h2>
        
        <div class="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
          <div v-for="item in carritoStore.items" :key="item.producto.id" class="flex justify-between border-b border-[#fff1da] pb-3">
            <span class="text-sm font-medium text-gray-700">{{ item.producto.name }} (x{{ item.cantidad }})</span>
            <span class="font-bold text-[#0e516c]">{{ formatoPrecio(item.producto.price * item.cantidad) }}</span>
          </div>
        </div>
        
        <div class="pt-4 border-t-2 border-[#fff1da] flex justify-between items-center text-[#0e516c] mb-6 md:mb-8">
          <span class="text-lg md:text-xl font-bold">Total</span>
          <span class="text-xl md:text-2xl font-bold">{{ formatoPrecio(carritoStore.precioTotal) }}</span>
        </div>

        <button 
          @click="handlePagarClick" 
          class="w-full py-4 md:py-5 bg-[#0e516c] text-white font-bold rounded-xl md:rounded-2xl shadow-xl hover:bg-[#0b4258] transition-all active:scale-95"
        >
          {{ authStore.token ? 'Pagar con MercadoPago' : 'Iniciar sesión para pagar' }} →
        </button>
        
        <div class="mt-4 flex items-center justify-center gap-3 text-[#0e516c]/60 text-xs">
           <span class="flex items-center gap-1">🔒 Pago 100% Seguro</span>
           <span class="flex items-center gap-1">🛡️ MercadoPago</span>
        </div>
      </div>

    </div>
  </div>
</template>
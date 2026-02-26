<script setup lang="ts">
import { ref } from 'vue';
import { useCarritoStore } from '@/stores/carrito';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const carritoStore = useCarritoStore();
const authStore = useAuthStore();
const router = useRouter();

const cargando = ref(false);
const error = ref('');
const paso = ref<'formulario' | 'procesando' | 'error'>('formulario');

// Pre-llenar si está logueado
const formulario = ref({
  nombre: authStore.usuario?.nombre || '',
  email: authStore.usuario?.email || '',
});

const formatoPrecio = (precio: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

const BASE_URL = 'http://localhost:3000'; // Cambiar por tu URL real

// PASO 1: Crear la orden en el backend
const crearOrden = async (): Promise<number | null> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`;

  const body = {
    nombre_cliente: formulario.value.nombre,
    email_cliente: formulario.value.email,
    // Armamos los detalles según la entidad Order del backend
    items: carritoStore.items.map(item => ({
      product_id: item.producto.id,
      quantity: item.cantidad,
      unit_price: item.producto.price,
    })),
    total_amount: carritoStore.precioTotal,
  };

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Error al crear la orden');
  }

  return data.order_id; // El backend devuelve { ok: true, order: { id: ... } }
};

// PASO 2: Crear la preferencia de MercadoPago con el orderId
const crearPreferencia = async (orderId: number): Promise<string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`;

  // CAMBIA ESTA LÍNEA:
  // Antes: const response = await fetch(`${BASE_URL}/api/payments/mp/preference`, ...
  
  const response = await fetch(`${BASE_URL}/api/payments/mp`, { // ✅ Ruta corregida
    method: 'POST',
    headers,
    body: JSON.stringify({ orderId }), 
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'Error al crear preferencia de pago');
  }

  return data.init_point; 
};

// FUNCIÓN PRINCIPAL: orquesta los dos pasos
const confirmarCompra = async () => {
  if (!formulario.value.nombre || !formulario.value.email) {
    error.value = 'Por favor completá todos los campos';
    return;
  }

  if (carritoStore.carritoVacio) {
    error.value = 'Tu carrito está vacío';
    return;
  }

  cargando.value = true;
  error.value = '';
  paso.value = 'procesando';

  try {
    // Paso 1: Crear orden
    const orderId = await crearOrden();
    if (!orderId) throw new Error('No se pudo crear la orden');

    // Paso 2: Crear preferencia MP
    const initPoint = await crearPreferencia(orderId);

    // Paso 3: Vaciar carrito y redirigir a MercadoPago
    carritoStore.vaciarCarrito();
    window.location.href = initPoint; // Redirige al checkout de MP

  } catch (err: any) {
    console.error('Error en checkout:', err);
    error.value = err.message || 'Ocurrió un error al procesar tu compra';
    paso.value = 'error';
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen font-serif py-12 px-4" style="background-color: #fff1da">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-8" style="color: #0e516c">Finalizar Compra</h1>

      <!-- Estado: Procesando -->
      <div v-if="paso === 'procesando'" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 mb-6" style="border-color: #0e516c"></div>
        <p class="text-xl font-semibold" style="color: #0e516c">Preparando tu pago...</p>
        <p class="text-gray-600 mt-2">Serás redirigido a MercadoPago</p>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="paso === 'error'" class="text-center py-20">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p class="text-xl font-semibold text-red-600 mb-2">Hubo un problema</p>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="paso = 'formulario'; error = ''"
          class="px-8 py-3 rounded-lg font-bold text-white"
          style="background-color: #0e516c"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Estado: Formulario -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Datos del cliente -->
        <div class="bg-white rounded-2xl shadow-lg p-8" style="border: 2px solid #0e516c">
          <h2 class="text-2xl font-bold mb-6" style="color: #0e516c">Tus datos</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2" style="color: #0e516c">
                Nombre completo
              </label>
              <input
                v-model="formulario.nombre"
                type="text"
                placeholder="Juan García"
                class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                style="border-color: #0e516c"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2" style="color: #0e516c">
                Email
              </label>
              <input
                v-model="formulario.email"
                type="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                style="border-color: #0e516c"
              />
            </div>
          </div>

          <div v-if="error" class="mt-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg">
            <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
          </div>

          <button
            @click="confirmarCompra"
            :disabled="cargando"
            class="w-full mt-6 py-4 rounded-lg font-bold text-xl text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3"
            style="background-color: #0e516c"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Pagar con MercadoPago
          </button>

          <p class="text-xs text-gray-500 text-center mt-3">
            Serás redirigido al sitio seguro de MercadoPago
          </p>
        </div>

        <!-- Resumen del carrito -->
        <div class="bg-white rounded-2xl shadow-lg p-8" style="border: 2px solid #0e516c">
          <h2 class="text-2xl font-bold mb-6" style="color: #0e516c">Tu pedido</h2>
          <div class="space-y-3 mb-6">
            <div
              v-for="item in carritoStore.items"
              :key="item.producto.id"
              class="flex justify-between items-center pb-3 border-b"
              style="border-color: #fff1da"
            >
              <div>
                <p class="font-bold text-sm" style="color: #0e516c">{{ item.producto.name }}</p>
                <p class="text-xs text-gray-500">x{{ item.cantidad }} — {{ formatoPrecio(item.producto.price) }} c/u</p>
              </div>
              <p class="font-bold" style="color: #0e516c">
                {{ formatoPrecio(item.producto.price * item.cantidad) }}
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center pt-4 border-t-2" style="border-color: #0e516c">
            <span class="text-2xl font-bold" style="color: #0e516c">Total:</span>
            <span class="text-2xl font-bold" style="color: #0e516c">
              {{ formatoPrecio(carritoStore.precioTotal) }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
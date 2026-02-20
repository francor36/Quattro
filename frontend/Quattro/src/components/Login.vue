<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps<{
  mostrar: boolean;
}>();

const emit = defineEmits<{
  cerrar: [];
}>();

const modo = ref<'login' | 'registro'>('login');
const cargando = ref(false);
const error = ref('');
const exito = ref('');

// Formulario de login
const loginForm = ref({
  email: '',
  password: ''
});

// Formulario de registro
const registroForm = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmarPassword: '',
  telefono: '',
  direccion: ''
});

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = 'Por favor completá todos los campos';
    return;
  }

  cargando.value = true;
  error.value = '';

  const resultado = await authStore.login({
    email: loginForm.value.email,
    password: loginForm.value.password
  });

  cargando.value = false;

  if (resultado.success) {
    emit('cerrar');
    limpiarFormularios();
    
    // Redirigir según rol
    if (authStore.esAdmin) {
      router.push('/admin');
    }
  } else {
    error.value = resultado.error || 'Error al iniciar sesión';
  }
};

const handleRegistro = async () => {
  const { nombre, apellido, email, password, confirmarPassword, telefono, direccion } = registroForm.value;

  if (!nombre || !apellido || !email || !password || !confirmarPassword) {
    error.value = 'Por favor completá todos los campos obligatorios';
    return;
  }

  if (password !== confirmarPassword) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  cargando.value = true;
  error.value = '';
  exito.value = '';

  const resultado = await authStore.registro({
    nombre,
    apellido,
    email,
    password,
    telefono: telefono || undefined,
    direccion: direccion || undefined,
    rol: 'cliente'
  });

  cargando.value = false;

  if (resultado.success) {
    exito.value = '¡Registro exitoso! Ahora podés iniciar sesión';
    limpiarFormularios();
    setTimeout(() => {
      modo.value = 'login';
      exito.value = '';
    }, 2000);
  } else {
    error.value = resultado.error || 'Error al registrar usuario';
  }
};

const limpiarFormularios = () => {
  loginForm.value = { email: '', password: '' };
  registroForm.value = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    direccion: ''
  };
  error.value = '';
  exito.value = '';
};

const cerrarModal = () => {
  limpiarFormularios();
  modo.value = 'login';
  emit('cerrar');
};

const cambiarModo = () => {
  modo.value = modo.value === 'login' ? 'registro' : 'login';
  error.value = '';
  exito.value = '';
};
</script>

<template>
  <div 
    v-if="mostrar"
    @click="cerrarModal"
    class="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4"
  >
    <div 
      @click.stop
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto"
      style="border: 3px solid #0e516c"
    >
      <!-- Botón cerrar -->
      <button 
        @click="cerrarModal"
        class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e516c" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-2" style="color: #0e516c">
          {{ modo === 'login' ? 'Iniciar Sesión' : 'Registrarse' }}
        </h2>
        <p class="text-gray-600">
          {{ modo === 'login' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta en Quattro' }}
        </p>
      </div>

      <!-- Formulario de Login -->
      <form v-if="modo === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="tu@email.com"
            class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
            style="border-color: #0e516c"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Contraseña</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
            style="border-color: #0e516c"
            required
          />
        </div>

        <!-- Mensajes -->
        <div v-if="error" class="bg-red-50 border-2 border-red-500 rounded-lg p-3">
          <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
        </div>

        <!-- Botón login -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style="background-color: #0e516c"
        >
          {{ cargando ? 'Iniciando...' : 'Ingresar' }}
        </button>
      </form>

      <!-- Formulario de Registro -->
      <form v-else @submit.prevent="handleRegistro" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Nombre *</label>
            <input
              v-model="registroForm.nombre"
              type="text"
              placeholder="Juan"
              class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              style="border-color: #0e516c"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Apellido *</label>
            <input
              v-model="registroForm.apellido"
              type="text"
              placeholder="García"
              class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
              style="border-color: #0e516c"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Email *</label>
          <input
            v-model="registroForm.email"
            type="email"
            placeholder="tu@email.com"
            class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            style="border-color: #0e516c"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Contraseña *</label>
          <input
            v-model="registroForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            style="border-color: #0e516c"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Confirmar contraseña *</label>
          <input
            v-model="registroForm.confirmarPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            style="border-color: #0e516c"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Teléfono</label>
          <input
            v-model="registroForm.telefono"
            type="tel"
            placeholder="+54 299 123 4567"
            class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            style="border-color: #0e516c"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2" style="color: #0e516c">Dirección</label>
          <input
            v-model="registroForm.direccion"
            type="text"
            placeholder="Calle 123, Ciudad"
            class="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
            style="border-color: #0e516c"
          />
        </div>

        <!-- Mensajes -->
        <div v-if="error" class="bg-red-50 border-2 border-red-500 rounded-lg p-3">
          <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
        </div>

        <div v-if="exito" class="bg-green-50 border-2 border-green-500 rounded-lg p-3">
          <p class="text-green-600 text-sm font-semibold">{{ exito }}</p>
        </div>

        <!-- Botón registro -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style="background-color: #0e516c"
        >
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <!-- Cambiar entre login y registro -->
      <div class="mt-6 text-center">
        <button
          @click="cambiarModo"
          class="text-sm font-semibold hover:underline"
          style="color: #0e516c"
        >
          {{ modo === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión' }}
        </button>
      </div>
    </div>
  </div>
</template>
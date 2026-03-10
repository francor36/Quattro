import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// --- TIPOS ---
export type RolUsuario = 'admin' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: RolUsuario;
}

export interface LoginCredenciales {
  email: string;
  password: string;
}

export interface RegistroData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol?: RolUsuario;
}

// --- CONFIGURACIÓN ---
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
  // --- ESTADO ---
  // Inicializamos directamente desde LocalStorage para evitar parpadeos de UI
  const usuario = ref<Usuario | null>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token') || null);

  // --- GETTERS ---
  const estaAutenticado = computed(() => usuario.value !== null && token.value !== null);
  const esAdmin = computed(() => usuario.value?.rol === 'admin');
  const esCliente = computed(() => usuario.value?.rol === 'cliente');
  const nombreCompleto = computed(() => 
    usuario.value ? `${usuario.value.nombre} ${usuario.value.apellido}` : ''
  );

  // --- ACCIONES ---

  /**
   * Proceso de Login
   */
  const login = async (credenciales: LoginCredenciales) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // Mapeo de la respuesta del backend
        usuario.value = {
          id: data.user.id,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          email: data.user.email,
          telefono: data.user.telefono,
          direccion: data.user.direccion,
          rol: data.user.rol
        };
        token.value = data.token;

        // Persistencia
        localStorage.setItem('usuario', JSON.stringify(usuario.value));
        if (token.value) localStorage.setItem('token', token.value);

        return { success: true, usuario: usuario.value };
      }

      return { success: false, error: data.message || 'Credenciales incorrectas' };

    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  /**
   * Registro de nuevo usuario
   */
  const registro = async (datos: RegistroData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        return { success: true, message: data.message || 'Usuario registrado exitosamente' };
      }

      return { success: false, error: data.message || data.error || 'Error al registrar usuario' };

    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error al conectar con el servidor' };
    }
  };

  /**
   * Cierre de sesión y limpieza de datos
   */
  const logout = () => {
    usuario.value = null;
    token.value = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  /**
   * Cargar sesión manualmente (opcional si se inicializa en el ref)
   */
  const cargarSesion = () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');

    if (usuarioGuardado && tokenGuardado) {
      try {
        usuario.value = JSON.parse(usuarioGuardado);
        token.value = tokenGuardado;
      } catch {
        logout();
      }
    }
  };

  return {
    usuario,
    token,
    estaAutenticado,
    esAdmin,
    esCliente,
    nombreCompleto,
    login,
    registro,
    logout,
    cargarSesion
  };
});
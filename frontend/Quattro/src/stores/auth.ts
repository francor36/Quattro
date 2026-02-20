import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const usuario = ref<Usuario | null>(null);
  const token = ref<string | null>(null);

  // Getters
  const estaAutenticado = computed(() => usuario.value !== null && token.value !== null);
  const esAdmin = computed(() => usuario.value?.rol === 'admin');
  const esCliente = computed(() => usuario.value?.rol === 'cliente');
  const nombreCompleto = computed(() => 
    usuario.value ? `${usuario.value.nombre} ${usuario.value.apellido}` : ''
  );

  // Actions
  const login = async (credenciales: LoginCredenciales) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // El backend devuelve { ok: true, token: string, user: {...} }
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

  const logout = () => {
    usuario.value = null;
    token.value = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

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
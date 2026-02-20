import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Producto, ItemCarrito } from '@/types/producto';

export const useCarritoStore = defineStore('carrito', () => {
  // Estado
  const items = ref<ItemCarrito[]>([]);
  const mostrarCarrito = ref(false);

  // Getters
  const cantidadTotal = computed(() => {
    return items.value.reduce((total, item) => total + item.cantidad, 0);
  });

  const precioTotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.producto.price * item.cantidad);
    }, 0);
  });

  const carritoVacio = computed(() => {
    return items.value.length === 0;
  });

  // Actions
  const agregarProducto = (producto: Producto, cantidad: number = 1) => {
    // Verificar stock disponible
    if (producto.stock !== undefined && producto.stock < cantidad) {
      alert('No hay suficiente stock disponible');
      return false;
    }

    const itemExistente = items.value.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      // Verificar que no exceda el stock
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (producto.stock !== undefined && nuevaCantidad > producto.stock) {
        alert('No puedes agregar más unidades. Stock insuficiente.');
        return false;
      }
      itemExistente.cantidad += cantidad;
    } else {
      items.value.push({
        producto,
        cantidad
      });
    }
    
    return true;
  };

  const eliminarProducto = (productoId: number) => {
    const index = items.value.findIndex(item => item.producto.id === productoId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    const item = items.value.find(item => item.producto.id === productoId);
    if (item) {
      // Verificar stock
      if (item.producto.stock !== undefined && cantidad > item.producto.stock) {
        alert('No hay suficiente stock disponible');
        return false;
      }
      
      if (cantidad <= 0) {
        eliminarProducto(productoId);
      } else {
        item.cantidad = cantidad;
      }
    }
    return true;
  };

  const vaciarCarrito = () => {
    items.value = [];
  };

  const toggleCarrito = () => {
    mostrarCarrito.value = !mostrarCarrito.value;
  };

  const abrirCarrito = () => {
    mostrarCarrito.value = true;
  };

  const cerrarCarrito = () => {
    mostrarCarrito.value = false;
  };

  return {
    // Estado
    items,
    mostrarCarrito,
    
    // Getters
    cantidadTotal,
    precioTotal,
    carritoVacio,
    
    // Actions
    agregarProducto,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    toggleCarrito,
    abrirCarrito,
    cerrarCarrito
  };
});
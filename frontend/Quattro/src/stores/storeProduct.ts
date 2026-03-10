import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth"; // Ajustado a tu nombre de archivo
import type { Producto } from "@/types/producto";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useProductStore = defineStore("products", () => {
  const auth = useAuthStore();
  
  // ESTADO INICIAL VACÍO
  const products = ref<Producto[]>([]);
  const loading = ref(false);

  const isAdmin = computed(() => auth.esAdmin);

  // Traer productos desde la API real
  const fetchProducts = async () => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        products.value = data; 
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      // Opcional: Si querés persistencia local sin API:
      // products.value = JSON.parse(localStorage.getItem('quattro_products') || '[]');
    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (nuevo: Partial<Producto>) => {
    if (!auth.esAdmin) return;
    
    // Aquí iría el POST a tu backend. 
    // Por ahora, lo agregamos al estado local para que lo veas al instante:
    const productoCompleto = { ...nuevo, id: Date.now() } as Producto;
    products.value = [productoCompleto, ...products.value];
    
    // Guardamos en LocalStorage por si no tenés el backend andando aún
    localStorage.setItem('quattro_products', JSON.stringify(products.value));
  };

  const updateProduct = async (id: number, datos: Partial<Producto>) => {
    if (!auth.esAdmin) return;
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      const copia = [...products.value];
      copia[index] = { ...copia[index], ...datos, id };
      products.value = copia;
      localStorage.setItem('quattro_products', JSON.stringify(products.value));
    }
  };

  const deleteProduct = async (id: number) => {
    if (!auth.esAdmin) return;
    products.value = products.value.filter(p => p.id !== id);
    localStorage.setItem('quattro_products', JSON.stringify(products.value));
  };

  return { products, loading, isAdmin, fetchProducts, addProduct, updateProduct, deleteProduct };
});
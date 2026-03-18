import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import type { Producto } from "@/types/producto";

const BASE_URL = import.meta.env.VITE_API_URL;

// Normaliza los datos de la API (MySQL devuelve números como strings)
const normalizar = (p: any): Producto => ({
  ...p,
  id: Number(p.id),
  price: Number(p.price),
  stock: Number(p.stock),
});

export const useProductStore = defineStore("products", () => {
  const auth = useAuthStore();

  const products = ref<Producto[]>([]);
  const loading = ref(false);

  const isAdmin = computed(() => auth.esAdmin);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      const response = await fetch(`${BASE_URL}/products`);
      const { result } = await response.json();
      products.value = Array.isArray(result) ? result.map(normalizar) : [];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  const addProduct = async (nuevo: Partial<Producto>) => {
    if (!auth.esAdmin) return;
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    const { result } = await response.json();
    if (result) products.value = [normalizar(result), ...products.value];
  };

  const updateProduct = async (id: number, datos: Partial<Producto>) => {
    if (!auth.esAdmin) return;
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const { result } = await response.json();
    if (result) {
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) products.value[index] = normalizar(result);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!auth.esAdmin) return;
    await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
    products.value = products.value.filter(p => p.id !== id);
  };

  return { products, loading, isAdmin, fetchProducts, addProduct, updateProduct, deleteProduct };
});
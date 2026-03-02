import { defineStore } from "pinia";
import { ref } from "vue";
import type { Producto } from "@/types/producto";
import api from "@/services/api";

export const useProductStore = defineStore("products", () => {
  const products = ref<Producto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/products");

      console.log("🧪 primer producto:", response.data.result[0]);


      // ✅ ACÁ ESTABA EL BUG
      products.value = response.data.result ?? [];

    } catch (e) {
      console.error(e);
      error.value = "Error al cargar productos";
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
});

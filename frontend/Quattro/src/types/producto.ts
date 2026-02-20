export interface Producto {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface ItemCarrito {
  producto : Producto;
  cantidad: number;
}
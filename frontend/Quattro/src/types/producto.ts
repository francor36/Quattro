export interface Producto {
  id: number;
  titulo: string;
  precio: number;
  imagen?: string;
  descripcion?: string;
  categoria?: string;
  stock?: number;
  created_at?:Date
}
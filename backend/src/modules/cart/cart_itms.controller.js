import AppDataSource from "../../providers/datasource.provider.js";
import {
  addCartItemSchema,
  updateCartItemSchema,
  cartIdParamSchema
} from "./schema/cartItem.schema.js";

// Repositorios
const cartRepository = AppDataSource.getRepository("ShoppingCart");
const cartItemRepository = AppDataSource.getRepository("CartItem");
const productRepository = AppDataSource.getRepository("Product");

// ... tus métodos getCartByUser, addCartItem, updateCartItem, removeCartItem
let item = await cartItemRepository.findOne({
  where: {
    cart: { id: cart.id },
    product: { id: productId }
  },
  relations: ["product"]
});

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await cartItemRepository.findOne({
      where: { id },
      relations: ["cart"]
    });

    if (!item) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    item.quantity = quantity;
    await cartItemRepository.save(item);

    res.json({ message: "Cantidad actualizada" });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar item" });
  }
};
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await cartItemRepository.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    await cartItemRepository.remove(item);

    res.json({ message: "Producto eliminado del carrito" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar item" });
  }
};

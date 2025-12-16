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
export const addCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // 1️⃣ Buscar producto
    const product = await productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 2️⃣ Buscar carrito del usuario
    let cart = await cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ["items"]
    });

    // 3️⃣ Si no existe, crearlo
    if (!cart) {
      cart = cartRepository.create({
        user: { id: userId },
        items: []
      });
      await cartRepository.save(cart);
    }

    // 4️⃣ Ver si el producto ya está en el carrito
    const existingItem = cart.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await cartItemRepository.save(existingItem);
    } else {
      const newItem = cartItemRepository.create({
        cart,
        product,
        quantity
      });
      await cartItemRepository.save(newItem);
    }

    return res.status(201).json({ message: "Producto agregado al carrito" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al agregar producto" });
  }
};
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

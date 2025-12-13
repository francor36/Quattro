import { request, response } from "express";
import AppDataSource from "../../providers/datasource.provider.js";
import { addCartItemSchema, updateCartItemSchema, cartIdParamSchema } from "./schema/shoppingCart.schema.js";
import { cartEntity } from "./entity/cart.entity.js";
import { cartItemEntity } from "./cart_item.entity.js";
import { productEntity } from "../product/product.entity.js";


const cartRepository = AppDataSource.getRepository("ShoppingCart");
const cartItemRepository = AppDataSource.getRepository("CartItem");
const productRepository = AppDataSource.getRepository("Product");

// ===================== OBTENER CARRITO DEL USUARIO =====================
const getCartByUser = async (req = request, res = response) => {
  try {
    const userId = req.user.id;
    let cart = await cartRepository.findOne({ where: { user: { id: userId } } });

    if (!cart) {
      // Crear carrito vacío si no existe
      cart = cartRepository.create({ user: { id: userId }, items: [] });
      await cartRepository.save(cart);
    }

    res.json({ ok: true, cart });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// ===================== AGREGAR ITEM AL CARRITO =====================
const addCartItem = async (req = request, res = response) => {
  try {
    await addCartItemSchema.validateAsync(req.body, { abortEarly: false });
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Verificar producto
    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) return res.status(404).json({ ok: false, message: "Producto no encontrado" });

    // Obtener o crear carrito
    let cart = await cartRepository.findOne({ where: { user: { id: userId } }, relations: ["items"] });
    if (!cart) {
      cart = cartRepository.create({ user: { id: userId }, items: [] });
      await cartRepository.save(cart);
    }

    // Revisar si el producto ya está en el carrito
    let item = cart.items.find((i) => i.product.id === productId);
    if (item) {
      item.quantity += quantity;
      await cartItemRepository.save(item);
    } else {
      item = cartItemRepository.create({ cart: { id: cart.id }, product: { id: productId }, quantity });
      await cartItemRepository.save(item);
    }

    // Actualizar items en el carrito
    cart = await cartRepository.findOne({ where: { id: cart.id }, relations: ["items", "items.product"] });

    res.json({ ok: true, cart, message: "Producto agregado al carrito" });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

// ===================== ACTUALIZAR CANTIDAD DE UN ITEM =====================
const updateCartItem = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    await updateCartItemSchema.validateAsync(req.body, { abortEarly: false });
    await cartIdParamSchema.validateAsync({ id });

    const { quantity } = req.body;

    const item = await cartItemRepository.findOne({ where: { id }, relations: ["cart"] });
    if (!item) return res.status(404).json({ ok: false, message: "Item no encontrado" });

    // Solo puede actualizar su propio carrito
    if (item.cart.user.id !== req.user.id) return res.status(403).json({ ok: false, message: "Acceso denegado" });

    item.quantity = quantity;
    await cartItemRepository.save(item);

    res.json({ ok: true, item, message: "Cantidad actualizada" });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

// ===================== ELIMINAR ITEM DEL CARRITO =====================
const removeCartItem = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    await cartIdParamSchema.validateAsync({ id });

    const item = await cartItemRepository.findOne({ where: { id }, relations: ["cart"] });
    if (!item) return res.status(404).json({ ok: false, message: "Item no encontrado" });

    if (item.cart.user.id !== req.user.id) return res.status(403).json({ ok: false, message: "Acceso denegado" });

    await cartItemRepository.remove(item);

    res.json({ ok: true, message: "Item eliminado del carrito" });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

export const cartController = {
  getCartByUser,
  addCartItem,
  updateCartItem,
  removeCartItem,
};

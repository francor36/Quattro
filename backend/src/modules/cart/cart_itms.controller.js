import AppDataSource from "../../providers/datasource.provider.js";
import { addCartItemSchema, updateCartItemSchema, cartIdParamSchema } from "./cart.schema.js";
import { cartEntity } from "./entity/cart.entity.js";
import { cartItemEntity } from "./cart_item.entity.js";
import { productEntity } from "../product/product.entity.js";

// Repositorios
const cartRepository = AppDataSource.getRepository("ShoppingCart");
const cartItemRepository = AppDataSource.getRepository("CartItem");
const productRepository = AppDataSource.getRepository("Product");

// ... tus métodos getCartByUser, addCartItem, updateCartItem, removeCartItem

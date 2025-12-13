
import { Router } from "express";
import { cartController } from "./cart.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const cartRoutes = Router();

// ===================== OBTENER CARRITO DEL USUARIO =====================
cartRoutes.get("/", authMiddleware, cartController.getCartByUser);

// ===================== AGREGAR ITEM AL CARRITO =====================
cartRoutes.post("/add", authMiddleware, cartController.addCartItem);

// ===================== ACTUALIZAR CANTIDAD DE UN ITEM =====================
cartRoutes.patch("/update/:id", authMiddleware, cartController.updateCartItem);

// ===================== ELIMINAR ITEM DEL CARRITO =====================
cartRoutes.delete("/remove/:id", authMiddleware, cartController.removeCartItem);

export default cartRoutes;

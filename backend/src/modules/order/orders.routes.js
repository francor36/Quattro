import { Router } from "express";
import { orderController } from "./orders.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const orderRoutes = Router();

orderRoutes.post("/", authMiddleware, orderController.createOrder);

export default orderRoutes;

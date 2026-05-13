import { Router } from "express";
import { validateBody, validateParams } from "../../middlewares/validator.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema
} from "./schema/product.schema.js";
import { productController } from "./product.controller.js";
import { upload } from "../../configurations/multer.config.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/isAdmin.js";

const productRoutes = Router();

// ✅ CREATE (multi imágenes)
productRoutes.post(
  "/products",
  authMiddleware,
  isAdmin,
  upload.array("images", 5), // 🔥 CLAVE
  validateBody(createProductSchema),
  productController.create
);

// ✅ GET ALL
productRoutes.get("/products", productController.findAll);

// ✅ GET ONE
productRoutes.get(
  "/products/:id",
  validateParams(idParamSchema),
  productController.findOne
);

// ✅ UPDATE (multi imágenes)
productRoutes.put(
  "/products/:id",
  authMiddleware,
  isAdmin,
  upload.array("images", 5), // 🔥 CLAVE
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  productController.update
);

// ✅ DELETE
productRoutes.delete(
  "/products/:id",
  validateParams(idParamSchema),
  authMiddleware,
  productController.remove
);

export default productRoutes;
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
import { authorizeRole } from "../../middlewares/role.middleware.js";

const productRoutes = Router();

productRoutes.post(
  "/products",
  authMiddleware,         
  isAdmin,                
  upload.single("file"),
  validateBody(createProductSchema),
  productController.create
);

productRoutes.get('/products',
  productController.findAll
);

productRoutes.get('/products/:id',
  validateParams(idParamSchema),
  productController.findOne
);

productRoutes.put('/products/:id',
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  authMiddleware, productController.update
);

productRoutes.delete('/products/:id',
  validateParams(idParamSchema),
  authMiddleware, productController.remove
);

export default productRoutes;
import { Router } from "express";
import { validateBody, validateParams } from "../../middlewares/validator.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema
} from "./schema/product.schema.js";
import { productController } from "./product.controller.js";
import { upload } from "../../configurations/multer.config.js";

const productRoutes = Router();

productRoutes.post(
  "/products",
  upload.single("file"),
  validateBody(createProductSchema),
  authMiddleware, productController.create
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
  authMiddleware,productController.update
);

productRoutes.delete('/products/:id',
  validateParams(idParamSchema),
  authMiddleware,productController.remove
);

export default productRoutes;
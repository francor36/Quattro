import { Router } from "express";
import { validateBody, validateParams } from "../../middlewares/validator.middleware.js";
import { 
  createProductSchema, 
  updateProductSchema,
  idParamSchema 
} from "./schema/product.schema.js";
import { productController } from "./product.controller.js";

const productRoutes = Router();

productRoutes.post('/products', 
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
    productController.update
);

productRoutes.delete('/products/:id',
    validateParams(idParamSchema),
    productController.remove
);

export default productRoutes;